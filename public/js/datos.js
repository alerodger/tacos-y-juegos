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

// Datos del panel en modo demostración (guardados en este navegador por admin-demo.js)
CE.demoLocal = () => {
  try {
    const db = JSON.parse(localStorage.getItem('ce-demo-db'));
    if (!db) return null;
    const orden = (l) => [...(l || [])].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    return {
      ajustes: { ...CE.demo.ajustes, ...(db.ajustes?.[0] || {}) },
      categorias: orden(db.categorias),
      platos: orden(db.platos).filter((p) => p.visible !== false),
      fotos: orden(db.fotos),
      premios: orden(db.premios).filter((p) => p.activo !== false),
      opiniones: orden(db.opiniones).filter((o) => o.visible !== false),
      demo: true,
    };
  } catch (e) { return null; }
};

CE.cargarDatos = async () => {
  if (!CE.api.activo) return CE.demoLocal() || { ...CE.demo, premios: [], demo: true };
  try {
    const [ajustes, categorias, platos, fotos, premios, opiniones] = await Promise.all([
      CE.api.get('ajustes?select=*&id=eq.1'),
      CE.api.get('categorias?select=*&order=orden'),
      CE.api.get('platos?select=*&visible=eq.true&order=orden'),
      CE.api.get('fotos?select=*&order=orden'),
      CE.api.get('premios?select=*&activo=eq.true&order=orden'),
      CE.api.get('opiniones?select=*&visible=eq.true&order=orden'),
    ]);
    return { ajustes: { ...CE.demo.ajustes, ...(ajustes[0] || {}) }, categorias, platos, fotos, premios, opiniones, demo: false };
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

// ---------- Horario semanal ----------
// horario: array de 7 (0 = domingo) con [abre, cierra] o null. Acepta "24:00" y cierres después de medianoche.
CE.horario = {
  min: (h) => { const [a, b] = String(h).split(':').map(Number); return a * 60 + (b || 0); },
  nombreDia(i, largo = true) {
    const ref = new Date(Date.UTC(2024, 0, 7 + i, 12)); // 7/1/2024 fue domingo
    const t = new Intl.DateTimeFormat(CE.idioma === 'es' ? 'es-ES' : 'de-DE', { weekday: largo ? 'long' : 'short', timeZone: 'UTC' }).format(ref);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  valido: (h) => Array.isArray(h) && h.length === 7,
  // Filas agrupando días seguidos (lunes primero) con el mismo horario
  filas(h) {
    if (!CE.horario.valido(h)) return [];
    const orden = [1, 2, 3, 4, 5, 6, 0];
    const clave = (d) => (h[d] ? `${h[d][0]}-${h[d][1]}` : 'x');
    const grupos = [];
    orden.forEach((d) => {
      const g = grupos[grupos.length - 1];
      if (g && clave(g.dias[g.dias.length - 1]) === clave(d)) g.dias.push(d); else grupos.push({ dias: [d] });
    });
    return grupos.map((g) => ({
      dias: g.dias.length === 1 ? CE.horario.nombreDia(g.dias[0]) : `${CE.horario.nombreDia(g.dias[0])} – ${CE.horario.nombreDia(g.dias[g.dias.length - 1])}`,
      horas: h[g.dias[0]] ? `${h[g.dias[0]][0]} – ${h[g.dias[0]][1]}` : CE.t('horario.cerrado'),
      cerrado: !h[g.dias[0]],
    }));
  },
  // Estado ahora mismo en hora de Alemania
  estado(h, ahora = new Date()) {
    if (!CE.horario.valido(h)) return null;
    const partes = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(ahora).map((p) => [p.type, p.value]));
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(partes.weekday);
    const m = Number(partes.hour) * 60 + Number(partes.minute);
    const tramo = (d) => { const t = h[(d + 7) % 7]; if (!t) return null; const a = CE.horario.min(t[0]); let c = CE.horario.min(t[1]); if (c <= a) c += 1440; return [a, c, t]; };
    const ayer = tramo(dia - 1);
    if (ayer && ayer[1] > 1440 && m < ayer[1] - 1440) return { abierto: true, hasta: ayer[2][1] };
    const hoy = tramo(dia);
    if (hoy && m >= hoy[0] && m < hoy[1]) return { abierto: true, hasta: hoy[2][1] };
    for (let k = 0; k < 8; k++) {
      const t = tramo(dia + k);
      if (t && (k > 0 || t[0] > m)) return { abierto: false, dias: k, dia: (dia + k) % 7, hora: t[2][0] };
    }
    return { abierto: false };
  },
  texto(h) {
    const e = CE.horario.estado(h);
    if (!e) return '';
    if (e.abierto) return `🟢 ${CE.t('horario.abierto')} · ${CE.t('horario.hasta')} ${e.hasta}`;
    if (e.hora === undefined) return `🔴 ${CE.t('horario.cerradoAhora')}`;
    const dia = CE.horario.nombreDia(e.dia);
    const cuando = e.dias === 0 ? CE.t('horario.hoy') : e.dias === 1 ? CE.t('horario.manana')
      : `${CE.t('horario.el')} ${CE.idioma === 'es' ? dia.toLowerCase() : dia}`;
    return `🔴 ${CE.t('horario.cerradoAhora')} · ${CE.t('horario.abre')} ${cuando} ${CE.t('horario.a')} ${e.hora}`;
  },
};

// Botones fijos en pantalla: carta, juegos e Instagram (barra abajo en móvil, columna en escritorio)
// Icono de Instagram (glifo en blanco sobre el degradado de la marca)
CE.iconoInstagram = () => `<span class="ig-icono" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
  <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="#fff" stroke="none"/></svg></span>`;

// ocultarCon: elemento con botones equivalentes (p. ej. los de la portada); mientras se vea, la barra se esconde
CE.botonesFijos = ({ carta, juegos, instagram, ocultarCon }) => {
  if (document.querySelector('.fijos')) return;
  const nav = document.createElement('nav');
  nav.className = 'fijos';
  const pintar = () => {
    nav.setAttribute('aria-label', CE.L({ es: 'Accesos rápidos', de: 'Schnellzugriff' }));
    nav.innerHTML = `
      <a href="${carta}"><span aria-hidden="true">🌮</span><b>${CE.t('nav.carta')}</b></a>
      <a href="${juegos}" class="juegos"><span aria-hidden="true">🎲</span><b>${CE.t('nav.juegos')}</b></a>
      ${instagram ? `<a href="https://www.instagram.com/${CE.esc(instagram)}/" target="_blank" rel="noopener">${CE.iconoInstagram()}<b>Instagram</b></a>` : ''}`;
  };
  pintar();
  document.addEventListener('idioma', pintar);
  document.body.appendChild(nav);
  document.body.classList.add('con-fijos');
  if (ocultarCon && 'IntersectionObserver' in window) {
    const poner = (oculta) => {
      nav.classList.toggle('escondida', oculta);
      nav.toggleAttribute('inert', oculta); // sin foco ni clics mientras está escondida
    };
    poner(true);
    new IntersectionObserver(([e]) => poner(e.isIntersecting), { threshold: 0 }).observe(ocultarCon);
  }
};
