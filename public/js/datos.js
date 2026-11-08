// Carga de datos: de Supabase si está configurado, si no los de ejemplo (demo.js).
window.CE = window.CE || {};

CE.esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

CE.precio = (n) => new Intl.NumberFormat(CE.idioma === 'es' ? 'es-ES' : 'de-DE', { style: 'currency', currency: 'EUR' }).format(n);

CE.cargarDatos = async () => {
  const { supabaseUrl, supabaseKey } = CE.config;
  if (!supabaseUrl || !supabaseKey) return { ...CE.demo, demo: true };
  // Se completará en la fase 3 (esquema de Supabase). Si falla, se muestran los de ejemplo.
  try {
    const get = async (ruta) => {
      const r = await fetch(`${supabaseUrl}/rest/v1/${ruta}`, { headers: { apikey: supabaseKey } });
      if (!r.ok) throw new Error(`${ruta}: ${r.status}`);
      return r.json();
    };
    const [ajustes, categorias, platos, fotos] = await Promise.all([
      get('ajustes?select=*&id=eq.1'),
      get('categorias?select=*&order=orden'),
      get('platos?select=*&visible=eq.true&order=orden'),
      get('fotos?select=*&order=orden'),
    ]);
    return { ajustes: { ...CE.demo.ajustes, ...(ajustes[0] || {}) }, categorias, platos, fotos, demo: false };
  } catch (e) {
    console.warn('Supabase no disponible, uso datos de ejemplo', e);
    return { ...CE.demo, demo: true };
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
