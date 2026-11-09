// Ranking general del salón: suma de puntos de todos los juegos con 🏆, por Instagram.
// Con Supabase usa las funciones guardar_puntuacion / ranking_global / mi_posicion.
// Sin Supabase funciona en modo DEMO: tus partidas se guardan en este móvil y se mezclan con
// jugadores de ejemplo (marcados como DEMO en pantalla).
window.CE = window.CE || {};

CE.ranking = {
  PERIODOS: ['dia', 'semana', 'mes'],
  get demo() { return !CE.api.activo; },
  normalizar: (ig) => String(ig || '').trim().replace(/^@/, '').toLowerCase(),
  valido: (ig) => /^[a-z0-9._]{1,30}$/.test(ig),
  recordar() { try { return JSON.parse(localStorage.getItem('ce-jugador')) || {}; } catch (e) { return {}; } },
  guardarRecuerdo(d) { try { localStorage.setItem('ce-jugador', JSON.stringify(d)); } catch (e) { /* nada */ } },
  modo: () => (CE.ajustes?.ranking_modo === 'suma' ? 'suma' : 'mejor'),

  // ---------- Acceso a datos (Supabase o demo) ----------
  async guardar({ juego, instagram, puntos, codigo, consiente }) {
    if (!CE.ranking.demo) {
      return CE.api.rpc('guardar_puntuacion', { p_juego: juego, p_instagram: instagram, p_puntos: puntos, p_codigo: codigo || null, p_consiente: !!consiente });
    }
    if (!consiente) return 'consentimiento';
    if (!CE.ranking.valido(instagram)) return 'datos';
    const partidas = CE.ranking.demoPartidas();
    partidas.push({ juego, instagram, puntos, t: Date.now() });
    try { localStorage.setItem('ce-demo-partidas', JSON.stringify(partidas.slice(-300))); } catch (e) { /* nada */ }
    return 'ok';
  },
  async top(periodo, limite = 15) {
    if (!CE.ranking.demo) return CE.api.rpc('ranking_global', { p_periodo: periodo, p_limite: limite });
    return CE.ranking.demoTotales(periodo).slice(0, limite);
  },
  async miPosicion(instagram, periodo) {
    if (!instagram) return null;
    if (!CE.ranking.demo) return (await CE.api.rpc('mi_posicion', { p_instagram: instagram, p_periodo: periodo }))[0] || null;
    const t = CE.ranking.demoTotales(periodo);
    const yo = t.find((x) => x.instagram === instagram);
    return yo ? { posicion: yo.posicion, puntos: yo.puntos, jugadores: t.length } : null;
  },

  // ---------- Modo demo ----------
  demoPartidas() { try { return JSON.parse(localStorage.getItem('ce-demo-partidas')) || []; } catch (e) { return []; } },
  inicioPeriodo(periodo) {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    if (periodo === 'semana') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    if (periodo === 'mes') d.setDate(1);
    return d.getTime();
  },
  demoTotales(periodo) {
    // Jugadores de ejemplo (inventados, con nombres de comida): puntos estables durante el día
    const nombres = ['tequila.tina', 'mariachi.max', 'lena.tacos', 'sofi.salsa', 'chili.chris', 'paula.pinata', 'tom_mezcal',
      'nina.nopal', 'felix.frijol', 'carla.cactus', 'ben.burrito', 'mia.margarita', 'luca.limon', 'hanna.habanero',
      'jan.jalapeno', 'eva.elote', 'tim.tortilla', 'noah.nachos', 'lara.lima', 'oscar.oaxaca', 'gina.guacamole', 'pepe.pibil'];
    const semilla = new Date().toDateString().length + new Date().getDate();
    const factor = { dia: 0.35, semana: 1, mes: 3.1 }[periodo] || 1;
    const filas = nombres.map((n, i) => ({
      instagram: n, demo: true,
      puntos: Math.round((3400 - i * 150 + ((i * 37 + semilla * 13) % 120)) * factor),
      juegos: 1 + ((i + semilla) % 5), ultima: i,
    }));
    // Mis partidas de verdad (guardadas en este móvil)
    const desde = CE.ranking.inicioPeriodo(periodo);
    const mias = {};
    CE.ranking.demoPartidas().filter((p) => p.t >= desde).forEach((p) => {
      const j = (mias[p.instagram] ||= { porJuego: {}, ultima: 0 });
      j.porJuego[p.juego] = CE.ranking.modo() === 'suma' ? (j.porJuego[p.juego] || 0) + p.puntos : Math.max(j.porJuego[p.juego] || 0, p.puntos);
      j.ultima = Math.max(j.ultima, p.t);
    });
    Object.entries(mias).forEach(([ig, j]) => {
      const previo = filas.findIndex((f) => f.instagram === ig);
      if (previo >= 0) filas.splice(previo, 1);
      filas.push({ instagram: ig, puntos: Object.values(j.porJuego).reduce((a, b) => a + b, 0), juegos: Object.keys(j.porJuego).length, ultima: j.ultima });
    });
    return filas.sort((a, b) => b.puntos - a.puntos || a.ultima - b.ultima).map((f, i) => ({ ...f, posicion: i + 1 }));
  },

  // ---------- Pintado ----------
  fila(f, yo) {
    const medallas = ['🥇', '🥈', '🥉'];
    return `<li class="${f.instagram === yo ? 'yo' : ''} ${f.posicion <= 3 ? `podio p${f.posicion}` : ''}">
      <span class="rk-pos">${medallas[f.posicion - 1] || f.posicion}</span>
      <span class="rk-nombre"><b>@${CE.esc(f.instagram)}</b>${f.juegos ? `<small>${f.juegos} ${CE.t(f.juegos === 1 ? 'rk.juego' : 'rk.juegos')}</small>` : ''}</span>
      <span class="rk-puntos">${Number(f.puntos).toLocaleString(CE.idioma === 'de' ? 'de-DE' : 'es-ES')}</span>
    </li>`;
  },
  // Lista del top + mi fila aparte si no estoy dentro
  listaHtml(filas, yo, mia) {
    if (!filas.length) return `<p class="rk-vacio">${CE.t('rk.vacio')}</p>`;
    const dentro = filas.some((f) => f.instagram === yo);
    return `<ol class="rk-lista">${filas.map((f) => CE.ranking.fila(f, yo)).join('')}
      ${!dentro && mia ? `<li class="rk-separador" aria-hidden="true">⋯</li>${CE.ranking.fila({ instagram: yo, posicion: mia.posicion, puntos: mia.puntos }, yo)}` : ''}</ol>`;
  },
  miPosicionHtml(mia, periodo) {
    if (!mia) return '';
    return `<p class="rk-mia">${CE.t('rk.tuPos')} (${CE.t(`rk.${periodo}`).toLowerCase()}): <b>#${mia.posicion}</b> ${CE.t('rk.de')} ${mia.jugadores}
      · <b>${Number(mia.puntos).toLocaleString(CE.idioma === 'de' ? 'de-DE' : 'es-ES')}</b> ${CE.t('rk.pts')}</p>`;
  },
  premiosHtml(premios, periodo) {
    const lista = (premios || []).filter((p) => p.periodo === periodo);
    return lista.length ? `<div class="rk-premios">${lista.map((p) => `<p>🎁 ${CE.esc(CE.tx(p, 'texto'))}</p>`).join('')}</div>` : '';
  },
  avisoDemo: () => (CE.ranking.demo ? `<p class="rk-demo">${CE.t('rk.demo')}</p>` : ''),

  // ---------- Formulario al terminar una partida ----------
  formulario(cont, { juego, puntos }) {
    const r = CE.ranking.recordar();
    const pideCodigo = !CE.ranking.demo && Boolean(CE.ajustes?.ranking_con_codigo);
    cont.innerHTML = `<form class="rk-form">
      <p class="rk-form-titulo">🏆 ${CE.t('rk.entrar')}</p>
      <label class="rk-ig"><span aria-hidden="true">@</span><input name="instagram" required maxlength="31" autocomplete="off" autocapitalize="none" spellcheck="false"
        aria-label="${CE.t('rk.instagramLabel')}" placeholder="${CE.t('rk.instagram')}" value="${CE.esc(r.instagram || '')}"></label>
      ${pideCodigo ? `<input name="codigo" required maxlength="20" autocomplete="off" placeholder="${CE.t('rk.codigo')}" style="text-transform:uppercase">` : ''}
      <label class="rk-consiente"><input type="checkbox" name="consiente" required ${r.consiente ? 'checked' : ''}>
        <span>${CE.t('rk.consiente')} <a href="../legal/bases.html" target="_blank">${CE.t('rk.bases')}</a> · <a href="../legal/datenschutz.html" target="_blank">${CE.t('pie.privacidad')}</a></span></label>
      <button class="boton" type="submit">${CE.t('rk.guardar')} (${CE.t('rk.sumados').replace('{p}', puntos)})</button>
      <p class="rk-error" aria-live="polite"></p>
    </form>`;
    const form = cont.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      const instagram = CE.ranking.normalizar(d.instagram);
      const error = (k) => { form.querySelector('.rk-error').textContent = CE.t(`rk.error.${k}`); };
      if (!CE.ranking.valido(instagram)) { error('datos'); return; }
      const boton = form.querySelector('button');
      boton.disabled = true;
      try {
        const res = await CE.ranking.guardar({ juego, instagram, puntos, codigo: d.codigo, consiente: !!d.consiente });
        if (res !== 'ok') { error(res); boton.disabled = false; return; }
        CE.ranking.guardarRecuerdo({ instagram, consiente: true });
        const [filas, mia] = await Promise.all([CE.ranking.top('semana', 3), CE.ranking.miPosicion(instagram, 'semana')]);
        cont.innerHTML = `<p class="rk-form-titulo">✅ ${CE.t('rk.guardado')} ${CE.t('rk.sumados').replace('{p}', puntos)}</p>
          ${CE.ranking.miPosicionHtml(mia, 'semana')}
          ${CE.ranking.listaHtml(filas, instagram, mia)}
          ${CE.ranking.avisoDemo()}
          <a class="rk-ver" href="./?ranking">${CE.t('rk.verTodo')} →</a>`;
      } catch (err) {
        console.error(err);
        error('red');
        boton.disabled = false;
      }
    });
  },

  // ---------- Página del top 15 (sala de juegos con ?ranking) ----------
  pagina(cont, { premios }) {
    let periodo = 'semana';
    const pintar = async () => {
      const yo = CE.ranking.recordar().instagram || '';
      cont.innerHTML = `<div class="rk-pagina">
        <div class="rk-pestanas periodos" role="group">${CE.ranking.PERIODOS.map((p) =>
          `<button type="button" data-p="${p}" aria-pressed="${p === periodo}">${CE.t(`rk.${p}`)}</button>`).join('')}</div>
        <p class="rk-explica">${CE.t(CE.ranking.modo() === 'suma' ? 'rk.explicaSuma' : 'rk.explicaMejor')}</p>
        ${CE.ranking.premiosHtml(premios, periodo)}
        <div class="rk-mia-caja"></div>
        <div class="rk-resultado"><p class="rk-vacio">…</p></div>
        ${CE.ranking.avisoDemo()}
        <p class="rk-nota">${CE.t('rk.nota')}</p>
      </div>`;
      try {
        const [filas, mia] = await Promise.all([CE.ranking.top(periodo, 15), CE.ranking.miPosicion(yo, periodo)]);
        cont.querySelector('.rk-mia-caja').innerHTML = mia ? CE.ranking.miPosicionHtml(mia, periodo) : `<p class="rk-mia vacia">${CE.t('rk.sinIg')}</p>`;
        cont.querySelector('.rk-resultado').innerHTML = CE.ranking.listaHtml(filas, yo, mia);
      } catch (e) {
        console.error(e);
        cont.querySelector('.rk-resultado').innerHTML = `<p class="rk-vacio">${CE.t('rk.error.red')}</p>`;
      }
    };
    cont.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-p]');
      if (b) { periodo = b.dataset.p; pintar(); }
    });
    pintar();
    return { idioma: pintar };
  },
};
