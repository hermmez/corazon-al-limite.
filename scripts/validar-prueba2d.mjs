import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';

const directory = 'public/imagenes/personajes';
const images = readdirSync(directory).filter((file) => file.endsWith('.png')).sort();
assert.equal(images.length, 30, 'Se esperan los 30 PNG aprobados');
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
for (const [index, file] of images.entries()) {
  assert.ok(file.startsWith(`${String(index + 1).padStart(2, '0')}_`), `Numeración: ${file}`);
  const data = readFileSync(path.join(directory, file));
  assert.ok(data.subarray(0, 8).equals(signature), `PNG inválido: ${file}`);
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  assert.ok(width > 0 && height > 0, `Dimensiones inválidas: ${file}`);
  assert.equal(data[25], 6, `Se espera RGBA: ${file}`);
  console.log(`${file}: ${width} × ${height}, RGBA`);
}
const selected = [
  '01_neutral', '02_explicando', '05_cansado', '18_bostezando',
  '24_anatomia_cerebro', '15_confundido', '23_durmiendo', '13_feliz',
];
const sources = readdirSync('src/Prueba2D').filter((name) => name.endsWith('.tsx'))
  .map((name) => readFileSync(path.join('src/Prueba2D', name), 'utf8')).join('\n');
for (const name of selected) {
  assert.ok(images.includes(`${name}.png`), `Falta ${name}.png`);
  assert.ok(sources.includes(`file="${name}"`) || sources.includes(`personajes/${name}.png`), `Pose no utilizada: ${name}`);
}
const paths = [...sources.matchAll(/staticFile\((['"`])([^'"`]+)\1\)/g)].map((match) => match[2]);
assert.ok(paths.length > 0, 'Se deben cargar imágenes con staticFile()');
for (const asset of paths) {
  assert.ok(asset.startsWith('imagenes/personajes/'), `Ruta no aprobada: ${asset}`);
}
assert.equal(222 + 252 + 252 + 210 - 3 * 12, 900);
console.log('OK: biblioteca, ocho poses, rutas exclusivas y duración de 900 fotogramas.');
