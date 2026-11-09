// Importa fotos de platos: npm run fotos -- <carpeta> [--reales]
// Cada archivo se llama como el plato (ver docs/prompts-fotos.md). Se recortan en cuadrado, se
// reducen a WebP en public/assets/platos/ y se anotan en public/js/fotos-platos.js.
// Sin --reales se marcan como generadas con IA ("Foto ilustrativa / Symbolbild").
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const carpeta = args.find((a) => !a.startsWith('--'));
const reales = args.includes('--reales');
if (!carpeta) { console.error('Uso: npm run fotos -- <carpeta> [--reales]'); process.exit(1); }

const manifiesto = path.join(raiz, 'public/js/fotos-platos.js');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(`var CE = window.CE = {};\n${fs.readFileSync(manifiesto, 'utf8')}\n${fs.readFileSync(path.join(raiz, 'public/js/demo.js'), 'utf8')}`, ctx);
const { CE } = ctx.window;
const slugs = new Set(CE.demo.platos.map((p) => CE.slug(p.nombre_es)));
const fotos = { ...CE.fotosPlatos };

const destino = path.join(raiz, 'public/assets/platos');
fs.mkdirSync(destino, { recursive: true });
let ok = 0;
for (const archivo of fs.readdirSync(carpeta)) {
  if (!/\.(jpe?g|png|webp|heic|avif)$/i.test(archivo)) continue;
  const slug = CE.slug(path.parse(archivo).name);
  if (!slugs.has(slug)) { console.warn(`⚠ ${archivo}: no hay ningún plato que se llame así (${slug})`); continue; }
  await sharp(path.join(carpeta, archivo)).rotate().resize(900, 900, { fit: 'cover' }).webp({ quality: 80 }).toFile(path.join(destino, `${slug}.webp`));
  fotos[slug] = { url: `assets/platos/${slug}.webp`, ia: !reales };
  ok++;
}
const lineas = Object.keys(fotos).sort().map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(fotos[k])},`).join('\n');
fs.writeFileSync(manifiesto, `// GENERADO por scripts/importar-fotos.mjs: fotos de los platos (por nombre en español).
// ia: true = foto generada con IA ("Foto ilustrativa / Symbolbild").
window.CE = window.CE || {};
CE.fotosPlatos = {
${lineas}
};
`);
console.log(`✔ ${ok} fotos importadas (${Object.keys(fotos).length} en total). Ahora: npm run semilla`);
