import fs from "node:fs/promises";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export class VoiceError extends Error {}
export const readJson = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
export const writeJson = async (file, value) => {
  const { dirname } = await import("node:path");
  await fs.mkdir(dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n");
};
export const clientFromEnvironment = () => {
  if (!process.env.ELEVENLABS_API_KEY)
    throw new VoiceError("Falta ELEVENLABS_API_KEY. Configúrala como secreto de Actions o variable local; no la incluyas en archivos.");
  return new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
};
export const safeApiDiagnostic = (error) => {
  const safeCodes = new Set(["quota_exceeded", "missing_permissions", "invalid_api_key", "voice_not_found", "paid_plan_required", "subscription_required", "payment_required", "insufficient_credits", "blocked_free_user", "too_many_concurrent_requests", "detected_unusual_activity"]);
  const code = error?.body?.detail?.status;
  return { httpStatus: Number.isInteger(error?.statusCode) ? error.statusCode : null, code: safeCodes.has(code) ? code : null };
};
export const reportError = (error) => {
  // Never log SDK objects, headers, request bodies, environment variables or stacks.
  const diagnostic = safeApiDiagnostic(error);
  const message = error instanceof VoiceError
    ? error.message
    : `La operación con ElevenLabs falló${diagnostic.httpStatus ? ` (HTTP ${diagnostic.httpStatus})` : ""}${diagnostic.code ? `: ${diagnostic.code}` : ""}. Revisa permisos, cuota y acceso a la voz; no se reintenta automáticamente.`;
  console.error(message);
  process.exitCode = 1;
};
const plain = (v, source) => ({
  voiceId: v.voiceId,
  name: v.name ?? "Sin nombre",
  source,
  category: v.category,
  labels: v.labels ?? {},
  gender: v.gender ?? v.labels?.gender ?? null,
  language: v.language ?? v.labels?.language ?? null,
  accent: v.accent ?? v.labels?.accent ?? null,
  locale: v.locale ?? v.labels?.locale ?? null,
  verifiedLanguages: (v.verifiedLanguages ?? []).map((l) => ({ language: l.language, locale: l.locale, accent: l.accent })),
  description: v.description ?? null,
  previewUrl: v.previewUrl ?? null,
  publicOwnerId: v.publicOwnerId ?? null,
  addedToAccount: source === "account" || v.isAddedByUser === true,
  freeUsersAllowed: v.freeUsersAllowed ?? null,
});
export const isMexicanMale = (v) => {
  const male = /^(male|masculino|hombre)$/i.test(v.gender ?? "");
  const locales = [v.locale, ...(v.verifiedLanguages ?? []).map((l) => l.locale)].filter(Boolean);
  const accents = [v.accent, ...(v.verifiedLanguages ?? []).map((l) => l.accent)].filter(Boolean);
  const spanish = [v.language, ...(v.verifiedLanguages ?? []).map((l) => l.language)].some((l) => /^(es|spanish|español)$/i.test(l ?? ""));
  return male && (locales.some((l) => /^es[-_]mx$/i.test(l)) || (spanish && accents.some((a) => /mexic|méxic/i.test(a))));
};
export const fetchCatalog = async (client, { includeLibrary = false, selectedVoiceId } = {}) => {
  const voices = [];
  let token;
  for (let page = 0; page < 20; page++) {
    const result = await client.voices.search({ pageSize: 100, nextPageToken: token }, { maxRetries: 0 });
    voices.push(...result.voices.map((v) => plain(v, "account")));
    if (!result.hasMore) break;
    if (!result.nextPageToken || result.nextPageToken === token)
      throw new VoiceError("Paginación de voces inválida; no se eligió una voz con un catálogo incompleto.");
    token = result.nextPageToken;
    if (page === 19) throw new VoiceError("El catálogo supera 2000 voces; reduce la consulta antes de elegir.");
  }
  if (includeLibrary || (selectedVoiceId
    ? !voices.some((v) => v.voiceId === selectedVoiceId)
    : !voices.some(isMexicanMale))) {
    const shared = await client.voices.getShared({ language: "es", gender: "male", locale: "es-MX", pageSize: 100, includeCustomRates: false }, { maxRetries: 0 });
    for (const v of shared.voices) if (!voices.some((a) => a.voiceId === v.voiceId)) voices.push(plain(v, "library"));
  }
  return {
    schemaVersion: 1,
    retrievedAt: new Date().toISOString(),
    generatedAudio: false,
    voices,
    candidates: voices.filter(isMexicanMale),
  };
};
