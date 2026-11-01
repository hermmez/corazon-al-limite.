import { clientFromEnvironment, fetchCatalog, readJson, reportError, safeApiDiagnostic, writeJson } from "./voz/catalogo.mjs";
try {
  const client = clientFromEnvironment();
  const catalog = await fetchCatalog(client);
  await writeJson("out/elevenlabs-voces.json", catalog);
  console.log(`Catálogo guardado: ${catalog.voices.length} voces, ${catalog.candidates.length} candidatas masculinas con metadatos de México. No se generó audio.`);
  for (const v of catalog.candidates.slice(0, 15))
    console.log(JSON.stringify({ voiceId: v.voiceId, name: v.name, accent: v.accent, locale: v.locale, source: v.source }));
  const config = await readJson("config/elevenlabs.json");
  const selected = catalog.voices.find((v) => v.voiceId === config.voiceId);
  const diagnostic = { generatedAudio: false, selectedVoiceId: config.voiceId,
    selectedVoiceInAccount: selected?.addedToAccount ?? false,
    selectedVoiceFound: Boolean(selected), subscription: null };
  try {
    const subscription = await client.user.subscription.get({ maxRetries: 0 });
    diagnostic.subscription = { tier: subscription.tier, status: subscription.status };
  } catch (error) { diagnostic.subscription = { queryFailed: true, ...safeApiDiagnostic(error) }; }
  await writeJson("out/elevenlabs-diagnostico.json", diagnostic);
  console.log(JSON.stringify(diagnostic));
} catch (error) { reportError(error); }
