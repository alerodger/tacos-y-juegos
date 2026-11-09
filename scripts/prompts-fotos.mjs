// Genera docs/prompts-fotos.md: un prompt por plato o cóctel para crear las fotos con una IA de
// imágenes (ChatGPT, Gemini, Midjourney…) con un estilo común. Uso: npm run prompts
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(`var CE = window.CE = {};\n${fs.readFileSync(path.join(raiz, 'public/js/demo.js'), 'utf8')}`, ctx);
const { CE } = ctx.window;
const cats = Object.fromEntries(CE.demo.categorias.map((c) => [c.id, c]));

const ESTILO_COMIDA = 'Fotografía gastronómica profesional, vista a 45 grados, plato de cerámica artesanal mexicana sobre mesa de madera oscura, luz cálida de velas, fondo desenfocado de cantina mexicana con toques de neón morado, aspecto real y apetecible, formato cuadrado 1:1, sin texto ni logotipos, sin personas.';
const ESTILO_BEBIDA = 'Fotografía profesional de bebida, vaso adecuado al cóctel con hielo y decoración, sobre barra de madera oscura, fondo desenfocado con botellas y luces de neón moradas y rosas, luz cálida, aspecto real, formato cuadrado 1:1, sin texto ni logotipos, sin personas.';

const filas = CE.demo.platos.filter((p) => !cats[p.cat].lista && !p.foto);
let md = `# Prompts para las fotos de la carta\n\n${filas.length} platos y bebidas sin foto. Para cada uno:\n\n`
  + '1. Copia el prompt en ChatGPT (o Gemini) y pide la imagen.\n'
  + '2. Guárdala con el **nombre de archivo** indicado (vale .jpg, .png o .webp) en una carpeta, p. ej. `~/fotos-carta`.\n'
  + '3. Cuando estén todas (o algunas): `npm run fotos -- ~/fotos-carta` → se optimizan y se asignan solas.\n\n'
  + 'En la carta salen marcadas como "Foto ilustrativa / Symbolbild". Cuando el restaurante haga la foto real desde el panel, la etiqueta desaparece.\n\n';
let cat = null;
for (const p of filas) {
  if (p.cat !== cat) { cat = p.cat; md += `\n## ${cats[cat].icono || ''} ${cats[cat].nombre_es}\n\n`; }
  const bebida = cats[cat].grupo === 'bebida';
  const que = `${bebida ? 'Bebida' : 'Plato'} «${p.nombre_es}»${p.desc_es ? `: ${p.desc_es.replace(/\.$/, '')}` : ''}.`;
  md += `**${CE.slug(p.nombre_es)}.jpg** — ${p.nombre_es}\n\n> ${que} ${bebida ? ESTILO_BEBIDA : ESTILO_COMIDA}\n\n`;
}
fs.mkdirSync(path.join(raiz, 'docs'), { recursive: true });
fs.writeFileSync(path.join(raiz, 'docs/prompts-fotos.md'), md);
console.log(`docs/prompts-fotos.md: ${filas.length} prompts`);
