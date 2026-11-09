// Piezas compartidas por los juegos de grupo y de beber.
window.CE = window.CE || {};

CE.jugadores = {
  lista() { try { return JSON.parse(localStorage.getItem('ce-jugadores')) || []; } catch (e) { return []; } },
  guardar(l) { try { localStorage.setItem('ce-jugadores', JSON.stringify(l)); } catch (e) { /* nada */ } },
};

// Pantalla para apuntar a los jugadores. Llama a alListo(lista) al pulsar "Empezar".
CE.pedirJugadores = (cont, { minimo = 2, alListo }) => {
  const t = CE.t; const esc = CE.esc;
  const ac = new AbortController();
  let lista = CE.jugadores.lista();
  const pintar = () => {
    const faltan = lista.length < minimo;
    cont.innerHTML = `<div class="jugadores">
      <h2>👥 ${t('jug.titulo')}</h2>
      <p>${t('jug.sub')}</p>
      <form class="jug-form">
        <input maxlength="16" placeholder="${t('jug.nombre')}" aria-label="${t('jug.nombre')}" autocomplete="off">
        <button class="boton amarillo" type="submit">+ ${t('jug.anadir')}</button>
      </form>
      <ul class="jug-lista">${lista.map((n, i) => `<li>${esc(n)}<button type="button" data-quitar="${i}" aria-label="${t('jug.quitar')} ${esc(n)}">✕</button></li>`).join('')}</ul>
      ${faltan ? `<p class="jug-min">${t('jug.minimo').replace('{n}', minimo)}</p>` : ''}
      <button class="boton" type="button" data-empezar ${faltan ? 'disabled' : ''}>▶ ${t('jug.empezar')}</button>
    </div>`;
  };
  cont.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = cont.querySelector('.jug-form input');
    const n = inp.value.trim();
    if (n && lista.length < 16) { lista.push(n); CE.jugadores.guardar(lista); }
    pintar();
    cont.querySelector('.jug-form input').focus();
  }, { signal: ac.signal });
  cont.addEventListener('click', (e) => {
    const q = e.target.closest('[data-quitar]');
    if (q) { lista.splice(Number(q.dataset.quitar), 1); CE.jugadores.guardar(lista); pintar(); return; }
    if (e.target.closest('[data-empezar]') && lista.length >= minimo) { ac.abort(); alListo([...lista]); }
  }, { signal: ac.signal });
  pintar();
  return { idioma: pintar, destruir: () => ac.abort() };
};

// Aviso de responsabilidad + enlace a la carta de bebidas (¡otra ronda!)
CE.pieBeber = () => `<p class="pie-beber">🥤 ${CE.t('beber.resp')} · <a href="../#carta-cocteles">🍹 ${CE.t('beber.carta')}</a></p>`;

CE.azar = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Interruptor "juegos para brindar" del salón (requiere haber confirmado +18)
CE.beber = {
  activo() { try { return localStorage.getItem('ce-beber') === 'si' && localStorage.getItem('ce-18') === 'si'; } catch (e) { return false; } },
  poner(v) { try { localStorage.setItem('ce-beber', v ? 'si' : 'no'); if (v) localStorage.setItem('ce-18', 'si'); } catch (e) { /* nada */ } },
};

// Gestiona un juego que primero pide jugadores y luego arranca.
// crear(escenario, jugadores, volverAJugadores) → { idioma?, destruir? }
CE.conJugadores = (escenario, minimo, crear) => {
  let actual;
  const pedir = () => {
    actual?.destruir?.();
    actual = CE.pedirJugadores(escenario, { minimo, alListo: (lista) => { actual = crear(escenario, lista, pedir); } });
  };
  // Si ya se apuntaron en el salón, se empieza directamente
  const lista = CE.jugadores.lista();
  if (lista.length >= minimo) actual = crear(escenario, lista, pedir);
  else pedir();
  return { idioma: () => actual?.idioma?.(), destruir: () => actual?.destruir?.() };
};
