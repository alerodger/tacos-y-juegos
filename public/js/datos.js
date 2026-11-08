// Carga de datos: de Supabase si está configurado, si no los de ejemplo (demo.js).
window.CE = window.CE || {};

CE.esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

CE.precio = (n) => new Intl.NumberFormat(CE.idioma === 'es' ? 'es-ES' : 'de-DE', { style: 'currency', currency: 'EUR' }).format(n);

// Acceso a Supabase por su API REST (sin librerías: la web pública no necesita más)
CE.api = {
  get activo() { return Boolean(CE.config.supabaseUrl && CE.config.supabaseKey); },
  cabeceras() { return { apikey: CE.config.supabaseKey, Authorization: `Bearer ${CE.config.supabaseKey}`, 'Content-Type': 'application/json' }; },
  async get(ruta) {
    const r = await fetch(`${CE.config.supabaseUrl}/rest/v1/${ruta}`, { headers: this.cabeceras() });
    if (!r.ok) throw new Error(`${ruta}: ${r.status}`);
    return r.json();
  },
  async rpc(funcion, args) {
    const r = await fetch(`${CE.config.supabaseUrl}/rest/v1/rpc/${funcion}`, { method: 'POST', headers: this.cabeceras(), body: JSON.stringify(args) });
    if (!r.ok) throw new Error(`${funcion}: ${r.status}`);
    return r.json();
  },
};

CE.cargarDatos = async () => {
  if (!CE.api.activo) return { ...CE.demo, premios: [], demo: true };
  try {
    const [ajustes, categorias, platos, fotos, premios] = await Promise.all([
      CE.api.get('ajustes?select=*&id=eq.1'),
      CE.api.get('categorias?select=*&order=orden'),
      CE.api.get('platos?select=*&visible=eq.true&order=orden'),
      CE.api.get('fotos?select=*&order=orden'),
      CE.api.get('premios?select=*&activo=eq.true&order=orden'),
    ]);
    return { ajustes: { ...CE.demo.ajustes, ...(ajustes[0] || {}) }, categorias, platos, fotos, premios, demo: false };
  } catch (e) {
    console.warn('Supabase no disponible, uso datos de ejemplo', e);
    return { ...CE.demo, premios: [], demo: true };
  }
};

// Banderitas de papel picado: rellena cada [data-papel-picado]
CE.papelPicado = () => {
  const colores = ['#d42d3b', '#f4ead9', '#e93d8f', '#2cc4d6', '#f2a541', '#a259ff', '#2e9e5b'];
  const forma = 'M0 0H60V56L55 62L50 56L45 62L40 56L35 62L30 56L25 62L20 56L15 62L10 56L5 62L0 56Z'
    + 'M30 16L39 28L30 40L21 28Z'                                     // rombo central
    + 'M30 22L34 28L30 34L26 28Z'                                     // (vuelve a rellenar el centro)
    + 'M10 12a4 4 0 1 0 .1 0ZM50 12a4 4 0 1 0 .1 0Z'                   // círculos de arriba
    + 'M10 40a4 4 0 1 0 .1 0ZM50 40a4 4 0 1 0 .1 0Z'                   // círculos de abajo
    + 'M6 5L9 8L12 5ZM18 5L21 8L24 5ZM36 5L39 8L42 5ZM48 5L51 8L54 5Z' // triangulitos
    + 'M27 46h6v4h-6Z';
  document.querySelectorAll('[data-papel-picado]').forEach((el) => {
    const n = Number(el.dataset.papelPicado) || 18;
    el.innerHTML = Array.from({ length: n }, (_, i) =>
      `<svg viewBox="0 0 60 62" style="--i:${i}"><path fill-rule="evenodd" fill="${colores[i % colores.length]}" d="${forma}"/></svg>`).join('');
  });
};
