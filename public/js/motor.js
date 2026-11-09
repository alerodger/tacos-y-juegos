// Utilidades comunes de los juegos: la cara del jefe, récords y pantalla de fin.
window.CE = window.CE || {};
CE.juegos = CE.juegos || {};

// Jefe dibujado por defecto (si el administrador no ha subido una foto)
CE.JEFE_SVG_INTERIOR = `
  <circle cx="50" cy="60" r="30" fill="#e0a878"/>
  <ellipse cx="22" cy="62" rx="5" ry="7" fill="#d39563"/><ellipse cx="78" cy="62" rx="5" ry="7" fill="#d39563"/>
  <ellipse cx="50" cy="36" rx="48" ry="9" fill="#f6a21e"/>
  <path d="M28 36Q30 6 50 6T72 36Z" fill="#f6a21e"/>
  <path d="M29 30Q50 36 71 30L72 36Q50 42 28 36Z" fill="#e8407c"/>
  <circle cx="40" cy="30" r="2" fill="#ffd23f"/><circle cx="50" cy="32" r="2" fill="#2e9e5b"/><circle cx="60" cy="30" r="2" fill="#ffd23f"/>
  <circle cx="39" cy="56" r="3.4" fill="#22180f"/><circle cx="61" cy="56" r="3.4" fill="#22180f"/>
  <path d="M33 48l10-2M67 48l-10-2" stroke="#3a2414" stroke-width="3" stroke-linecap="round"/>
  <path d="M50 70c-6-6-20-6-24 4 6-2 12 0 16 2 4 1 6-1 8-2 2 1 4 3 8 2 4-2 10-4 16-2-4-10-18-10-24-4z" fill="#3a2414"/>
  <path d="M42 80q8 6 16 0" stroke="#8a3b2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

// Devuelve un fragmento SVG con la cara del jefe, centrado en (cx, cy) con diámetro d
CE.jefeEnSvg = (cx, cy, d, id = 'jefe') => {
  const url = CE.ajustes?.cara_jefe;
  if (url) {
    return `<clipPath id="${id}-clip"><circle cx="${cx}" cy="${cy}" r="${d / 2}"/></clipPath>
      <image href="${CE.esc(url)}" x="${cx - d / 2}" y="${cy - d / 2}" width="${d}" height="${d}" clip-path="url(#${id}-clip)" preserveAspectRatio="xMidYMid slice"/>
      <circle cx="${cx}" cy="${cy}" r="${d / 2}" fill="none" stroke="#22180f" stroke-width="2"/>`;
  }
  const s = d * 1.25; // el sombrero sobresale
  return `<svg x="${cx - s / 2}" y="${cy - s * .6}" width="${s}" height="${s}" viewBox="0 0 100 100">${CE.JEFE_SVG_INTERIOR}</svg>`;
};

CE.jefeHtml = (clase = '') => {
  const url = CE.ajustes?.cara_jefe;
  return url
    ? `<img class="cara-jefe ${clase}" src="${CE.esc(url)}" alt="">`
    : `<svg class="cara-jefe ${clase}" viewBox="0 0 100 100" aria-hidden="true">${CE.JEFE_SVG_INTERIOR}</svg>`;
};

CE.barajar = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// Récord personal guardado en este navegador
CE.record = (juego, puntos) => {
  const k = `ce-record-${juego}`;
  let anterior = 0;
  try { anterior = Number(localStorage.getItem(k)) || 0; } catch (e) { /* nada */ }
  const nuevo = puntos > anterior;
  if (nuevo) { try { localStorage.setItem(k, String(puntos)); } catch (e) { /* nada */ } }
  return { mejor: Math.max(puntos, anterior), nuevo };
};

// Pantalla de fin de partida sobre el escenario del juego
CE.finPartida = (escenario, { juego, puntos, alOtra }) => {
  puntos = Math.min(puntos, CE.maxPuntos?.[juego] ?? puntos); // mismo tope que la base de datos
  const { mejor, nuevo } = CE.record(juego, puntos);
  const capa = document.createElement('div');
  capa.className = 'fin-partida';
  capa.innerHTML = `
    <div class="fin-caja">
      ${CE.jefeHtml('grande')}
      <h2>${CE.t('fin.titulo')}</h2>
      <p class="fin-puntos"><b>${puntos}</b> ${CE.t('fin.puntos')}</p>
      <p>${nuevo && puntos > 0 ? `🎉 ${CE.t('fin.record')}` : `${CE.t('fin.mejor')}: <b>${mejor}</b>`}</p>
      <div class="fin-rk"></div>
      <button class="boton amarillo" type="button" data-otra>🔁 ${CE.t('fin.otra')}</button>
    </div>`;
  capa.querySelector('[data-otra]').addEventListener('click', () => { capa.remove(); alOtra(); });
  escenario.appendChild(capa);
  const conRanking = CE.catalogo?.find((j) => j.id === juego)?.ranking && puntos > 0;
  if (conRanking && CE.ranking) CE.ranking.formulario(capa.querySelector('.fin-rk'), { juego, puntos });
  capa.querySelector('[data-otra]').focus();
};

// Imagen de la cara del jefe para dibujar en <canvas> (foto subida o jefe dibujado)
CE.imagenJefe = () => new Promise((ok) => {
  const img = new Image();
  const url = CE.ajustes?.cara_jefe;
  img.onload = () => ok({ img, foto: Boolean(url) });
  img.onerror = () => { if (url) { CE.ajustes.cara_jefe = null; CE.imagenJefe().then(ok); } else ok({ img: null }); };
  img.src = url || `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${CE.JEFE_SVG_INTERIOR}</svg>`)}`;
});

// Dibuja la cara del jefe centrada en (x, y) con diámetro d (en círculo si es una foto)
CE.dibujarJefe = (ctx, jefe, x, y, d) => {
  if (!jefe?.img) return;
  if (jefe.foto) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, d / 2, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(jefe.img, x - d / 2, y - d / 2, d, d); ctx.restore();
    ctx.beginPath(); ctx.arc(x, y, d / 2, 0, Math.PI * 2); ctx.lineWidth = Math.max(2, d / 30); ctx.strokeStyle = '#22180f'; ctx.stroke();
  } else {
    const s = d * 1.25; ctx.drawImage(jefe.img, x - s / 2, y - s * 0.6, s, s);
  }
};

// Lienzo que se adapta al ancho del escenario (con nitidez en pantallas retina)
CE.lienzo = (escenario, proporcion = 4 / 3) => {
  const c = document.createElement('canvas');
  c.className = 'lienzo';
  const ctx = c.getContext('2d');
  const medida = { w: 0, h: 0 };
  const ajustar = () => {
    const cs = getComputedStyle(escenario);
    const w = Math.min(escenario.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), 560);
    const h = Math.min(w * proporcion, window.innerHeight * 0.68);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    c.style.width = `${w}px`; c.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    medida.w = w; medida.h = h;
  };
  ajustar();
  window.addEventListener('resize', ajustar);
  return { c, ctx, medida, quitar: () => window.removeEventListener('resize', ajustar) };
};

// Capa de "Toca para empezar" con instrucciones
CE.pantallaInicio = (cont, { icono, texto, alEmpezar }) => {
  const capa = document.createElement('div');
  capa.className = 'inicio-juego';
  capa.innerHTML = `<div class="inicio-caja">${CE.jefeHtml('grande')}<p class="inicio-icono">${icono}</p><p>${texto}</p>
    <button class="boton amarillo grande" type="button">▶ ${CE.L({ es: '¡Empezar!', de: 'Los geht’s!' })}</button></div>`;
  capa.querySelector('button').addEventListener('click', () => { capa.remove(); alEmpezar(); });
  cont.appendChild(capa);
};
