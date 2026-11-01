import { clientFromEnvironment, fetchCatalog, reportError, writeJson } from "./voz/catalogo.mjs";
try {
  const catalog = await fetchCatalog(clientFromEnvironment());
  await writeJson("out/elevenlabs-voces.json", catalog);
  console.log(`Catálogo guardado: ${catalog.voices.length} voces, ${catalog.candidates.length} candidatas masculinas con metadatos de México. No se generó audio.`);
  for (const v of catalog.candidates.slice(0, 15))
    console.log(JSON.stringify({ voiceId: v.voiceId, name: v.name, accent: v.accent, locale: v.locale, source: v.source }));
} catch (error) { reportError(error); }
