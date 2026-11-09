// Salón de juegos: portada con la mesa (jugadores + interruptor de juegos para brindar), la tele
// del top 3 y las tarjetas de los juegos. También muestra un juego concreto (?j=<id>) o el
// ranking completo (?ranking).
(async () => {
  const esc = CE.esc;
  const sala = document.getElementById('sala');
  CE.montarIdiomas();
  CE.papelPicado();

  const datos = await CE.cargarDatos();
  CE.ajustes = datos.ajustes;
  document.querySelectorAll('.logo img').forEach((img) => { img.alt = datos.ajustes.nombre; });

  const params = new URLSearchParams(location.search);

  // ---------- Ranking completo ----------
  if (params.has('ranking')) {
    sala.innerHTML = `<div class="juego-barra"><a class="boton claro" href="./">← ${CE.t('sala.volver')}</a><h1>🏆 ${CE.t('rk.titulo')}</h1></div><div id="rk"></div>`;
    const pag = CE.ranking.pagina(document.getElementById('rk'), { premios: datos.premios });
    document.addEventListener('idioma', () => {
      sala.querySelector('.juego-barra a').textContent = `← ${CE.t('sala.volver')}`;
      sala.querySelector('.juego-barra h1').textContent = `🏆 ${CE.t('rk.titulo')}`;
      pag.idioma();
    });
    CE.aplicarIdioma();
    return;
  }

  const id = params.get('j');
  const juego = CE.catalogo.find((j) => j.id === id && j.listo && CE.juegos[j.id]);
  let activo = null;
  let tele = null;
  let pidiendoEdad = false;

  // ---------- Portada del salón ----------
  const portada = (j) => `../assets/juegos/${j.id}.webp`;
  function tarjeta(j, bloqueada) {
    const etiquetas = [
      j.ranking ? '<span class="tj-tag oro">🏆 Ranking</span>' : '',
      j.cat === 'beber' ? '<span class="tj-tag">🔞</span>' : '',
      `<span class="tj-tag">👥 ${j.min > 1 ? CE.t('sala.min').replace('{n}', j.min) : CE.t('sala.solo')}</span>`,
    ].join('');
    const interior = `
      <span class="tj-portada" style="--c:${j.color}">
        <span class="tj-emoji" aria-hidden="true">${j.icono}</span>
        <img src="${portada(j)}" alt="" loading="lazy" onerror="this.remove()">
        <span class="tj-etiquetas">${etiquetas}</span>
        <span class="tj-play" aria-hidden="true">▶</span>
      </span>
      <span class="tj-info"><b>${esc(CE.tx(j, 'nombre'))}</b><small>${esc(CE.tx(j, 'desc'))}</small></span>`;
    return bloqueada
      ? `<a class="tarjeta-juego bloqueada" href="?j=${j.id}" title="${esc(CE.t('sala.min').replace('{n}', j.min))}">${interior}</a>`
      : `<a class="tarjeta-juego" href="?j=${j.id}">${interior}</a>`;
  }

  function pintarLista() {
    tele?.destruir();
    const jugadores = CE.jugadores.lista();
    const n = Math.max(1, jugadores.length);
    const beber = CE.beber.activo();
    const disponibles = CE.catalogo.filter((j) => j.listo && CE.juegos[j.id] && (beber || j.cat !== 'beber'));
    const caben = disponibles.filter((j) => j.min <= n);
    const faltan = disponibles.filter((j) => j.min > n);
    const ocultosBeber = CE.catalogo.filter((j) => j.cat === 'beber' && j.listo).length;

    sala.innerHTML = `
      <section class="salon-cabeza">
        <div class="salon-titulo">
          ${CE.jefeHtml('saluda')}
          <div><h1>${CE.t('sala.titulo')}</h1><p>${CE.t('sala.sub')}</p></div>
        </div>
        <div class="salon-tele" data-tele></div>
      </section>

      <section class="mesa" aria-labelledby="mesa-titulo">
        <div class="mesa-jugadores">
          <h2 id="mesa-titulo">👥 ${CE.t('sala.mesa')} <small>${jugadores.length || ''}</small></h2>
          <p>${CE.t('sala.mesaSub')}</p>
          <ul class="jug-lista">${jugadores.map((nom, i) => `<li>${esc(nom)}<button type="button" data-quitar="${i}" aria-label="${CE.t('jug.quitar')} ${esc(nom)}">✕</button></li>`).join('')}</ul>
          <form class="jug-form" data-anadir>
            <input maxlength="16" placeholder="${CE.t('jug.nombre')}" aria-label="${CE.t('jug.nombre')}" autocomplete="off">
            <button class="boton amarillo" type="submit">+ ${CE.t('jug.anadir')}</button>
          </form>
        </div>
        <div class="mesa-beber">
          <label class="interruptor">
            <input type="checkbox" data-beber ${beber ? 'checked' : ''}>
            <span class="interruptor-pista" aria-hidden="true"></span>
            <span><b>🍻 ${CE.t('sala.beber')}</b><small>${CE.t('sala.beberSub')}</small></span>
          </label>
          <div class="edad-mini" data-edad hidden>
            <p>🔞 ${CE.t('edad.titulo')}</p>
            <button class="boton amarillo pequeno" type="button" data-edad-si>${CE.t('edad.si')}</button>
            <button class="boton contorno pequeno" type="button" data-edad-no>${CE.t('edad.no').replace(/,.*/, '')}</button>
          </div>
        </div>
      </section>

      ${CE.categoriasJuego.map((c) => {
        const lista = caben.filter((j) => j.cat === c.id);
        if (!lista.length) return '';
        return `<section class="salon-grupo">
          <h2>${CE.t(`cat.${c.id}`)}</h2>
          ${c.id === 'beber' ? `<p class="aviso-18">🔞 ${CE.t('aviso18')}</p>` : ''}
          <div class="salon-rejilla">${lista.map((j) => tarjeta(j, false)).join('')}</div>
        </section>`;
      }).join('')}

      ${!beber ? `<p class="beber-oculto">${CE.t('sala.beberOculto').replace('{n}', ocultosBeber)}</p>` : ''}

      ${faltan.length ? `<section class="salon-grupo apagado">
        <h2>🔒 ${CE.t('sala.faltan')}</h2>
        <p class="salon-ayuda">${CE.t('sala.faltanSub')}</p>
        <div class="salon-rejilla">${faltan.sort((a, b) => a.min - b.min).map((j) => tarjeta(j, true)).join('')}</div>
      </section>` : ''}

      <p class="sala-volver"><a class="boton amarillo" href="?ranking">🏆 ${CE.t('sala.verRanking')}</a> <a class="boton contorno" href="../">← ${CE.t('sala.web')}</a></p>`;
    tele = CE.tele(sala.querySelector('[data-tele]'), { enlace: '?ranking' });
  }

  // Eventos de la portada (delegados)
  sala.addEventListener('submit', (e) => {
    if (juego || !e.target.matches('[data-anadir]')) return;
    e.preventDefault();
    const inp = e.target.querySelector('input');
    const nombre = inp.value.trim();
    const lista = CE.jugadores.lista();
    if (nombre && lista.length < 16) { lista.push(nombre); CE.jugadores.guardar(lista); }
    pintarLista();
    sala.querySelector('[data-anadir] input')?.focus();
  });
  sala.addEventListener('click', (e) => {
    if (juego) return;
    const q = e.target.closest('[data-quitar]');
    if (q) { const l = CE.jugadores.lista(); l.splice(Number(q.dataset.quitar), 1); CE.jugadores.guardar(l); pintarLista(); return; }
    if (e.target.closest('[data-edad-si]')) { CE.beber.poner(true); pidiendoEdad = false; pintarLista(); return; }
    if (e.target.closest('[data-edad-no]')) { pidiendoEdad = false; sala.querySelector('[data-edad]').hidden = true; sala.querySelector('[data-beber]').checked = false; }
  });
  sala.addEventListener('change', (e) => {
    if (juego || !e.target.matches('[data-beber]')) return;
    let mayor = false;
    try { mayor = localStorage.getItem('ce-18') === 'si'; } catch (err) { /* nada */ }
    if (e.target.checked && !mayor) {
      e.target.checked = false; pidiendoEdad = true;
      sala.querySelector('[data-edad]').hidden = false;
      return;
    }
    CE.beber.poner(e.target.checked);
    pintarLista();
  });

  // ---------- Un juego concreto ----------
  function pintarJuego() {
    sala.innerHTML = `
      <div class="juego-barra">
        <a class="boton claro" href="./">← ${CE.t('sala.volver')}</a>
        <h1>${juego.icono} ${esc(CE.tx(juego, 'nombre'))}</h1>
      </div>
      <div class="escenario" id="escenario"></div>`;
    const escenario = document.getElementById('escenario');
    let mayor = false;
    try { mayor = localStorage.getItem('ce-18') === 'si'; } catch (e) { /* nada */ }
    if (juego.cat === 'beber' && !mayor) pedirEdad(escenario);
    else activo = CE.juegos[juego.id].iniciar(escenario);
  }

  // Confirmación de mayoría de edad (si se entra a un juego de beber directamente, p. ej. por enlace)
  function pedirEdad(escenario) {
    const pintar = () => {
      escenario.innerHTML = `<div class="edad">
        <span class="edad-ico">🔞</span>
        <h2>${CE.t('edad.titulo')}</h2>
        <p>${CE.t('edad.texto')}</p>
        <div class="cartas-botones">
          <button class="boton amarillo" type="button" data-si>${CE.t('edad.si')}</button>
          <a class="boton contorno" href="./">${CE.t('edad.no')}</a>
        </div>
      </div>`;
      escenario.querySelector('[data-si]').addEventListener('click', () => {
        CE.beber.poner(true);
        activo = CE.juegos[juego.id].iniciar(escenario);
      });
    };
    pintar();
    activo = { idioma: pintar };
  }

  document.addEventListener('idioma', () => {
    if (!juego) { if (!pidiendoEdad) pintarLista(); return; }
    sala.querySelector('.juego-barra a').textContent = `← ${CE.t('sala.volver')}`;
    sala.querySelector('.juego-barra h1').textContent = `${juego.icono} ${CE.tx(juego, 'nombre')}`;
    activo?.idioma?.();
  });

  if (juego) {
    document.title = `${CE.tx(juego, 'nombre')} · ${datos.ajustes.nombre}`;
    pintarJuego();
  }
  CE.aplicarIdioma(); // dispara 'idioma' → pinta la portada
})();
