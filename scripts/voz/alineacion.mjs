import { VoiceError } from "./catalogo.mjs";

export const alignmentToCaptions = (text, alignment) => {
  const chars = alignment?.characters;
  const starts = alignment?.characterStartTimesSeconds;
  const ends = alignment?.characterEndTimesSeconds;
  if (!Array.isArray(chars) || !Array.isArray(starts) || !Array.isArray(ends) ||
      chars.length !== starts.length || chars.length !== ends.length || chars.join("") !== text)
    throw new VoiceError("La alineación no corresponde al texto original. El audio se conserva; no se regenerará automáticamente.");
  let cursor = 0;
  const positions = chars.map((char, i) => {
    if (typeof char !== "string" || !Number.isFinite(starts[i]) || !Number.isFinite(ends[i]) ||
        starts[i] < 0 || ends[i] < starts[i] || (i && starts[i] < starts[i - 1]))
      throw new VoiceError("Marcas temporales de ElevenLabs inválidas.");
    const position = { start: cursor, end: cursor + char.length };
    cursor = position.end;
    return position;
  });
  const words = [...text.matchAll(/\S+/gu)];
  let previousEnd = 0;
  return words.map((word, i) => {
    const first = positions.findIndex((p) => p.end > word.index);
    const last = positions.findLastIndex((p) => p.start < word.index + word[0].length);
    const startMs = Math.max(previousEnd, Math.round(starts[first] * 1000));
    const endMs = Math.max(startMs + 1, Math.round(ends[last] * 1000));
    previousEnd = endMs;
    return {
      text: (i ? " " : "") + word[0], startMs, endMs,
      timestampMs: (startMs + endMs) / 2, confidence: null,
      pageBreakAfter: (i + 1) % 5 === 0 || i === words.length - 1,
    };
  });
};

// A single short synthesis covers the first two scenes. Split at the silence
// between sentences; both clips refer to the same immutable MP3.
export const splitAlignedScenes = (scenes, captions, audio) => {
  if (captions.map((c) => c.text).join("") !== scenes.map((s) => s.narration.text).join(" "))
    throw new VoiceError("Los subtítulos no coinciden con las escenas solicitadas.");
  let index = 0, offsetMs = 0;
  return scenes.map((scene, sceneIndex) => {
    const count = scene.narration.text.trim().split(/\s+/).length;
    const selected = captions.slice(index, index + count);
    index += count;
    const next = captions[index];
    const endMs = sceneIndex === scenes.length - 1
      ? audio.durationSeconds * 1000
      : (selected.at(-1).endMs + next.startMs) / 2;
    if (!selected.length || selected.at(-1).endMs > endMs + 1 || endMs <= offsetMs)
      throw new VoiceError("La duración medida del MP3 no contiene toda la alineación.");
    const clip = {
      sceneId: scene.id, text: scene.narration.text, src: audio.src,
      offsetSeconds: offsetMs / 1000,
      durationSeconds: (endMs - offsetMs) / 1000,
      audioDurationSeconds: audio.durationSeconds,
      sha256: audio.sha256,
      captionTiming: "elevenlabs_character_alignment",
      captions: selected.map((c, i) => ({
        ...c, text: (i ? " " : "") + c.text.trim(),
        startMs: Math.max(0, Math.round(c.startMs - offsetMs)),
        endMs: Math.min(Math.round(endMs - offsetMs), Math.round(c.endMs - offsetMs)),
        timestampMs: Math.max(0, Math.round(c.timestampMs - offsetMs)),
        pageBreakAfter: (i + 1) % 5 === 0 || i === selected.length - 1,
      })),
    };
    offsetMs = endMs;
    return clip;
  });
};
