// Genera supabase/semilla.sql a partir de public/js/demo.js (carta, ajustes, fotos).
// Uso: node scripts/generar-semilla.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(`var CE = window.CE = {};\n${fs.readFileSync(path.join(raiz, 'public/js/demo.js'), 'utf8')}`, ctx);
const { ajustes, categorias, platos, fotos, opiniones } = ctx.window.CE.demo;

const q = (v) => {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'object') return `${q(JSON.stringify(v))}::jsonb`;
  return `'${String(v).replace(/'/g, "''")}'`;
};
const fila = (cols, o) => `(${cols.map((c) => q(o[c])).join(', ')})`;

const colsAjustes = ['id', 'nombre', 'eslogan_es', 'eslogan_de', 'direccion', 'cp_ciudad', 'telefono', 'email', 'instagram',
  'reserva_url', 'maps_url', 'valoracion', 'valoracion_opiniones', 'valoracion_fuente', 'horario', 'cara_jefe',
  'promo_ruleta_es', 'promo_ruleta_de', 'valoraciones'];
const colsCat = ['id', 'grupo', 'icono', 'nombre_es', 'nombre_de', 'nota_es', 'nota_de', 'lista', 'orden'];
const colsPlato = ['cat', 'sub_es', 'sub_de', 'nombre_es', 'nombre_de', 'desc_es', 'desc_de', 'precio', 'variantes',
  'opciones_es', 'opciones_de', 'picante', 'veg', 'vegano', 'destacado', 'foto', 'orden'];
const colsFoto = ['url', 'texto_es', 'texto_de', 'ancho', 'orden'];
const colsOpinion = ['autor', 'fuente', 'fecha', 'idioma', 'texto_es', 'texto_de', 'texto_original', 'foto', 'url', 'orden'];

const sql = `-- GENERADO por scripts/generar-semilla.mjs a partir de public/js/demo.js. No editar a mano.
-- Ejecutar DESPUÉS de esquema.sql. Borra y vuelve a cargar la carta, la galería y los ajustes.
begin;

insert into ajustes (${colsAjustes.join(', ')}) values
${fila(colsAjustes, { ...ajustes, id: 1 })}
on conflict (id) do update set ${colsAjustes.filter((c) => c !== 'id').map((c) => `${c} = excluded.${c}`).join(', ')};

delete from platos;
delete from categorias;
insert into categorias (${colsCat.join(', ')}) values
${categorias.map((c, i) => fila(colsCat, { lista: false, ...c, orden: i })).join(',\n')};

insert into platos (${colsPlato.join(', ')}) values
${platos.map((p, i) => fila(colsPlato, { variantes: [], picante: 0, veg: false, vegano: false, destacado: false, ...p, orden: i })).join(',\n')};

delete from fotos;
insert into fotos (${colsFoto.join(', ')}) values
${fotos.map((f, i) => fila(colsFoto, { ancho: 1, ...f, orden: i })).join(',\n')};

delete from opiniones;
insert into opiniones (${colsOpinion.join(', ')}) values
${opiniones.map((o, i) => fila(colsOpinion, { texto_original: null, url: null, ...o, orden: i })).join(',\n')};

insert into premios (periodo, texto_es, texto_de, orden)
select * from (values
  ('semana', 'Un chupito de tequila para el número 1 de la semana', 'Ein Tequila-Shot für die Nummer 1 der Woche', 1),
  ('mes', 'Una ronda de margaritas para tu mesa', 'Eine Runde Margaritas für deinen Tisch', 2)
) as v(periodo, texto_es, texto_de, orden)
where not exists (select 1 from premios);

commit;
`;
fs.writeFileSync(path.join(raiz, 'supabase/semilla.sql'), sql);
console.log(`semilla.sql: ${categorias.length} categorías, ${platos.length} platos, ${fotos.length} fotos, ${opiniones.length} opiniones`);
