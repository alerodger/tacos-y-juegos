// Genera las portadas de los juegos (public/assets/juegos/<id>.webp): juega unos segundos a cada
// juego, hace una captura real y la monta en un móvil sobre el color del juego.
// Uso: servidor local en marcha (python3 -m http.server 8766 -d public) y después
//      npm run portadas            (o: node scripts/portadas.mjs http://localhost:8766/ pinata quiz)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const [base = 'http://localhost:8766/', ...solo] = process.argv.slice(2);
const salida = path.join(raiz, 'public/assets/juegos');
fs.mkdirSync(salida, { recursive: true });

// Chromium de Playwright instalado en ~/.cache/ms-playwright
const cache = path.join(process.env.HOME, '.cache/ms-playwright');
const dir = fs.readdirSync(cache).filter((d) => d.startsWith('chromium-')).sort().pop();
const navegador = await chromium.launch({ executablePath: path.join(cache, dir, 'chrome-linux64/chrome') });

// Catálogo (colores e iconos) leído del propio JS de la web
const ventana = {};
new Function('window', `var CE = window.CE = {};\n${fs.readFileSync(path.join(raiz, 'public/js/catalogo.js'), 'utf8')}`)(ventana);
const catalogo = ventana.CE.catalogo.filter((j) => j.listo && (!solo.length || solo.includes(j.id)));

// Qué hacer en cada juego para que la captura enseñe algo interesante
const espera = (p, ms) => p.waitForTimeout(ms);
const clic = async (p, s) => { const l = p.locator(s).first(); if (await l.count()) await l.click(); };
const ACCIONES = {
  pinata: async (p) => { await clic(p, '.inicio-juego button'); const c = await p.locator('canvas').boundingBox(); for (let i = 0; i < 14; i++) { await p.mouse.click(c.x + c.width / 2, c.y + c.height * 0.45); await espera(p, 60); } },
  lluvia: async (p) => { await clic(p, '.inicio-juego button'); const c = await p.locator('canvas').boundingBox(); for (let i = 0; i < 16; i++) { await p.mouse.move(c.x + 60 + (i % 4) * 60, c.y + c.height - 40); await espera(p, 160); } },
  ahorcado: async (p) => { for (const l of 'AEOS') await clic(p, `button[data-l="${l}"]:not([disabled])`); },
  quiz: async (p) => { await espera(p, 1500); },
  memoria: async (p) => { await clic(p, '[data-i="0"]'); await clic(p, '[data-i="5"]'); await espera(p, 450); },
  impostor: async (p) => { await clic(p, '[data-repartir]'); await clic(p, '[data-ver]'); await espera(p, 600); },
  adivina: async (p) => { await clic(p, '[data-mazo="mexico"]'); await espera(p, 400); },
  loteria: async (p) => { for (const i of [0, 5, 6, 10]) await clic(p, `[data-casilla="${i}"]`); },
  dedo: async (p) => {
    await p.evaluate(() => { const z = document.querySelector('[data-zona]'); const r = z.getBoundingClientRect();
      [[1, 90, 110], [2, 250, 200], [3, 150, 300]].forEach(([id, x, y]) => z.dispatchEvent(new PointerEvent('pointerdown', { pointerId: id, clientX: r.left + x, clientY: r.top + y, bubbles: true }))); });
    await espera(p, 2700);
  },
  pirinola: async (p) => { await clic(p, '[data-girar]'); await espera(p, 3200); },
  ruleta: async (p) => { await clic(p, '[data-girar]'); await espera(p, 4600); },
  verdadreto: async (p) => { await clic(p, '[data-mazo="reto"]'); await espera(p, 600); },
  cubilete: async (p) => { await clic(p, '[data-tirar]'); await espera(p, 700); await clic(p, '[data-dado="1"]'); },
  yonunca: async (p) => { await clic(p, '[data-mazo]'); await espera(p, 600); },
  masprobable: async (p) => { await clic(p, '[data-mazo]'); await espera(p, 600); },
};

const ctx = await navegador.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, locale: 'es', hasTouch: true });
await ctx.addInitScript(() => {
  localStorage.setItem('ce-jugadores', JSON.stringify(['Ana', 'Lukas', 'Pepe', 'Mia']));
  localStorage.setItem('ce-18', 'si'); localStorage.setItem('ce-beber', 'si'); localStorage.setItem('ce-idioma', 'es');
});
const p = await ctx.newPage();
const montaje = await (await navegador.newContext({ viewport: { width: 640, height: 400 } })).newPage();

for (const j of catalogo) {
  await p.goto(`${base}juegos/?j=${j.id}`);
  await espera(p, 500);
  await ACCIONES[j.id]?.(p);
  const caja = await p.locator('#escenario').boundingBox();
  const captura = await p.screenshot({ clip: { x: caja.x, y: caja.y, width: caja.width, height: Math.min(caja.height, caja.width * 1.55) } });
  await montaje.setContent(`<!doctype html><html><head><style>
    body { margin: 0; width: 640px; height: 400px; overflow: hidden; font-family: sans-serif; }
    .p { position: relative; width: 640px; height: 400px; overflow: hidden;
      background: radial-gradient(circle at 25% 30%, color-mix(in srgb, ${j.color} 65%, #fff), ${j.color} 40%, color-mix(in srgb, ${j.color} 35%, #000) 100%); }
    .rayos { position: absolute; inset: -40%; background: repeating-conic-gradient(from 0deg at 30% 45%, rgba(255,255,255,.12) 0 6deg, transparent 6deg 14deg); }
    .emoji { position: absolute; left: 70px; top: 50%; transform: translateY(-50%) rotate(-10deg); font-size: 190px; filter: drop-shadow(0 18px 18px rgba(0,0,0,.35)); }
    .chispa { position: absolute; font-size: 44px; filter: drop-shadow(0 6px 6px rgba(0,0,0,.3)); }
    .movil { position: absolute; right: 54px; top: 34px; width: 210px; height: 400px; border-radius: 30px; background: #111; padding: 9px;
      transform: rotate(7deg); box-shadow: 0 30px 50px rgba(0,0,0,.5); }
    .movil img { width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 22px; display: block; }
  </style></head><body><div class="p"><div class="rayos"></div>
    <div class="emoji">${j.icono}</div><span class="chispa" style="left:300px;top:40px">✨</span><span class="chispa" style="left:40px;top:300px">⭐</span>
    <div class="movil"><img src="data:image/png;base64,${captura.toString('base64')}"></div></div></body></html>`);
  await montaje.waitForTimeout(150);
  const png = await montaje.screenshot();
  const destino = path.join(salida, `${j.id}.webp`);
  await sharp(png).webp({ quality: 78 }).toFile(destino);
  console.log(`✔ ${j.id}  ${Math.round(fs.statSync(destino).size / 1024)} KB`);
}
await navegador.close();
