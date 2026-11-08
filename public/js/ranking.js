// Rankings con premios: formulario al terminar una partida y página de rankings.
window.CE = window.CE || {};

CE.ranking = {
  PERIODOS: ['dia', 'semana', 'mes'],
  recordar() { try { return JSON.parse(localStorage.getItem('ce-jugador')) || {}; } catch (e) { return {}; } },
  guardarRecuerdo(d) { try { localStorage.setItem('ce-jugador', JSON.stringify(d)); } catch (e) { /* nada */ } },

  async top(juego, periodo, limite = 10) {
    return CE.api.rpc('ranking', { p_juego: juego, p_periodo: periodo, p_limite: limite });
  },

  listaHtml(filas, resaltar) {
    if (!filas.length) return `<p class="rk-vacio">${CE.t('rk.vacio')}</p>`;
    const medallas = ['🥇', '🥈', '🥉'];
    return `<ol class="rk-lista">${filas.map((f, i) => `
      <li class="${resaltar && (f.instagram || f.alias).toLowerCase() === resaltar ? 'yo' : ''}">
        <span class="rk-pos">${medallas[i] || i + 1}</span>
        <span class="rk-nombre"><b>${CE.esc(f.alias)}</b>${f.instagram ? `<small>@${CE.esc(f.instagram)}</small>` : ''}</span>
        <span class="rk-puntos">${f.puntos}</span>
      </li>`).join('')}</ol>`;
  },

  premiosHtml(premios, periodo, juego) {
    const lista = (premios || []).filter((p) => p.periodo === periodo && (!p.juego || p.juego === juego));
    return lista.length ? `<div class="rk-premios">${lista.map((p) => `<p>🎁 ${CE.esc(CE.tx(p, 'texto'))}</p>`).join('')}</div>` : '';
  },

  // Formulario para guardar la puntuación (dentro de la pantalla de fin de partida)
  formulario(cont, { juego, puntos }) {
    if (!CE.api.activo) { cont.innerHTML = `<p class="fin-ranking">🏆 ${CE.t('fin.ranking')}</p>`; return; }
    const r = CE.ranking.recordar();
    const pideCodigo = Boolean(CE.ajustes?.ranking_con_codigo);
    cont.innerHTML = `<form class="rk-form">
      <p class="rk-form-titulo">🏆 ${CE.t('rk.entrar')}</p>
      <input name="alias" required minlength="2" maxlength="20" autocomplete="nickname" placeholder="${CE.t('rk.alias')}" value="${CE.esc(r.alias || '')}">
      <input name="instagram" maxlength="31" autocomplete="off" placeholder="${CE.t('rk.instagram')}" value="${CE.esc(r.instagram ? `@${r.instagram}` : '')}">
      ${pideCodigo ? `<input name="codigo" required maxlength="20" autocomplete="off" placeholder="${CE.t('rk.codigo')}" style="text-transform:uppercase">` : ''}
      <label class="rk-consiente"><input type="checkbox" name="consiente" required ${r.consiente ? 'checked' : ''}>
        <span>${CE.t('rk.consiente')} <a href="../legal/bases.html" target="_blank">${CE.t('rk.bases')}</a> · <a href="../legal/datenschutz.html" target="_blank">${CE.t('pie.privacidad')}</a></span></label>
      <button class="boton" type="submit">${CE.t('rk.guardar')}</button>
      <p class="rk-error" aria-live="polite"></p>
    </form>`;
    const form = cont.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      const instagram = (d.instagram || '').trim().replace(/^@/, '').toLowerCase();
      const boton = form.querySelector('button');
      boton.disabled = true;
      try {
        const res = await CE.api.rpc('guardar_puntuacion', {
          p_juego: juego, p_alias: d.alias.trim(), p_instagram: instagram || null, p_puntos: puntos,
          p_codigo: d.codigo || null, p_consiente: Boolean(d.consiente),
        });
        if (res !== 'ok') { form.querySelector('.rk-error').textContent = CE.t(`rk.error.${res}`); boton.disabled = false; return; }
        CE.ranking.guardarRecuerdo({ alias: d.alias.trim(), instagram, consiente: true });
        const filas = await CE.ranking.top(juego, 'semana', 5);
        cont.innerHTML = `<p class="rk-form-titulo">✅ ${CE.t('rk.guardado')}</p>
          ${CE.ranking.listaHtml(filas, (instagram || d.alias.trim()).toLowerCase())}
          <a class="rk-ver" href="?ranking=${juego}">${CE.t('rk.verTodo')} →</a>`;
      } catch (err) {
        console.error(err);
        form.querySelector('.rk-error').textContent = CE.t('rk.error.red');
        boton.disabled = false;
      }
    });
  },

  // Página completa de rankings (sala de juegos con ?ranking)
  pagina(cont, { premios, juegoInicial }) {
    const juegos = CE.catalogo.filter((j) => j.ranking && j.listo && CE.juegos[j.id]);
    let juego = juegos.some((j) => j.id === juegoInicial) ? juegoInicial : juegos[0]?.id;
    let periodo = 'semana';
    const pintar = async () => {
      cont.innerHTML = `<div class="rk-pagina">
        <div class="rk-pestanas" role="group">${juegos.map((j) => `<button type="button" data-j="${j.id}" aria-pressed="${j.id === juego}">${j.icono} ${CE.esc(CE.tx(j, 'nombre'))}</button>`).join('')}</div>
        <div class="rk-pestanas periodos" role="group">${CE.ranking.PERIODOS.map((p) => `<button type="button" data-p="${p}" aria-pressed="${p === periodo}">${CE.t(`rk.${p}`)}</button>`).join('')}</div>
        ${CE.ranking.premiosHtml(premios, periodo, juego)}
        <div class="rk-resultado">${CE.api.activo ? '<p class="rk-vacio">…</p>' : `<p class="rk-vacio">🏆 ${CE.t('fin.ranking')}</p>`}</div>
        <p class="rk-nota">${CE.t('rk.nota')}</p>
        <a class="boton amarillo" href="?j=${juego}">▶ ${CE.t('rk.jugar')}</a>
      </div>`;
      if (!CE.api.activo) return;
      try {
        const filas = await CE.ranking.top(juego, periodo, 20);
        cont.querySelector('.rk-resultado').innerHTML = CE.ranking.listaHtml(filas, (CE.ranking.recordar().instagram || CE.ranking.recordar().alias || '').toLowerCase());
      } catch (e) { cont.querySelector('.rk-resultado').innerHTML = `<p class="rk-vacio">${CE.t('rk.error.red')}</p>`; }
    };
    cont.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b?.dataset.j) { juego = b.dataset.j; pintar(); }
      if (b?.dataset.p) { periodo = b.dataset.p; pintar(); }
    });
    pintar();
    return { idioma: pintar };
  },
};
