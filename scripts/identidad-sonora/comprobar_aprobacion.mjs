import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const canonical = (value) => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
};
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
export const narratorFingerprint = (voice) => sha(JSON.stringify(canonical({
  provider: voice.provider, voiceId: voice.voiceId, modelId: voice.modelId,
  synthesisSettings: voice.synthesisSettings,
})));

/** Production-only gate. Previews must remain explicitly provisional elsewhere.
 * Evidence is added only after an actual user approval; never by synthesis or QA.
 */
export async function assertApprovedNarrator({profilePath = 'config/corazon-cinematic-mx.json', candidate} = {}) {
  const config = JSON.parse(await fs.readFile(path.resolve(repo, profilePath), 'utf8'));
  const approval = config.approval;
  const official = config.officialVoice;
  if (config.approvalStatus !== 'approved-by-user' || approval?.status !== 'approved-by-user' || !official) {
    throw new Error('CORAZON_CINEMATIC_MX sigue pendiente de aprobación del usuario. Escuchar la muestra y aprobar proveedor, voz, modelo y ajustes antes de integrar un narrador definitivo. Una previsualización debe permanecer provisional.');
  }
  if (typeof approval.userDecision !== 'string' || approval.userDecision.trim().length < 10 || !approval.approvedAt) {
    throw new Error('Falta el registro de la decisión real del usuario. No se autoriza selección automática.');
  }
  if (!candidate?.provider || !candidate.voiceId || !candidate.modelId || !candidate.synthesisSettings) {
    throw new Error('La toma debe declarar proveedor, voiceId, modelId y ajustes completos.');
  }
  if (narratorFingerprint(candidate) !== narratorFingerprint(official) || approval.narratorFingerprint !== narratorFingerprint(official)) {
    throw new Error('La toma no coincide exactamente con la voz y los ajustes aprobados. Se requiere nueva audición.');
  }
  if (!approval.sampleFile || !/^[a-f0-9]{64}$/.test(approval.sampleSha256 || '')) {
    throw new Error('Falta la huella del audio que escuchó y aprobó el usuario.');
  }
  const sample = path.resolve(repo, approval.sampleFile);
  if (sample !== repo && !sample.startsWith(repo + path.sep)) throw new Error('La muestra de aprobación debe pertenecer a esta entrega.');
  if (sha(await fs.readFile(sample)) !== approval.sampleSha256) throw new Error('Cambió la muestra aprobada. Se conserva la voz anterior hasta una nueva aprobación.');
  return {approved: true, profile: config.profile, officialVoice: official, approval};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const config = JSON.parse(await fs.readFile(path.join(repo, 'config/corazon-cinematic-mx.json'), 'utf8'));
    console.log(JSON.stringify(await assertApprovedNarrator({candidate: config.officialVoice}), null, 2));
  } catch (error) {console.error(error.message); process.exitCode = 2;}
}
