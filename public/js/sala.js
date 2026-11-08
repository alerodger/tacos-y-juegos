// Sala de juegos: lista de juegos o un juego concreto (?j=<id>).
(async () => {
  const esc = CE.esc;
  const sala = document.getElementById('sala');
  CE.montarIdiomas();
  CE.papelPicado();

  const datos = await CE.cargarDatos();
  CE.ajustes = datos.ajustes;
  document.querySelectorAll('.logo img').forEach((img) => { img.alt = datos.ajustes.nombre; });

  const id = new URLSearchParams(location.search).get('j');
  const juego = CE.catalogo.find((j) => j.id === id && j.listo && CE.juegos[j.id]);
  let activo = null;

  function pintarLista() {
    sala.innerHTML = `
      <section class="sala-cabeza">
        ${CE.jefeHtml('saluda')}
        <div><h1>${CE.t('sala.titulo')}</h1><p>${CE.t('sala.sub')}</p></div>
      </section>
      ${CE.categoriasJuego.map((c) => `
        <section class="sala-grupo">
          <h2>${c.icono} ${CE.t(`cat.${c.id}`)}</h2>
          ${c.id === 'beber' ? `<p class="aviso-18">🔞 ${CE.t('aviso18')}</p>` : ''}
          <div class="sala-rejilla">
            ${CE.catalogo.filter((j) => j.cat === c.id).map((j) => {
              const listo = j.listo && CE.juegos[j.id];
              const interior = `
                <span class="ficha-icono">${j.icono}</span>
                <span class="ficha-texto"><b>${esc(CE.tx(j, 'nombre'))}${j.ranking ? ' 🏆' : ''}</b>
                <small>${esc(CE.tx(j, 'desc'))}</small></span>
                ${listo ? '<span class="ficha-flecha" aria-hidden="true">▶</span>' : `<span class="ficha-pronto">${CE.t('sala.pronto')}</span>`}`;
              return listo
                ? `<a class="ficha" href="?j=${j.id}">${interior}</a>`
                : `<div class="ficha bloqueada" aria-disabled="true">${interior}</div>`;
            }).join('')}
          </div>
        </section>`).join('')}
      <p class="sala-volver"><a class="boton contorno" href="../">← ${CE.t('sala.web')}</a></p>`;
  }

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

  // Confirmación de mayoría de edad para los juegos de beber
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
        try { localStorage.setItem('ce-18', 'si'); } catch (e) { /* nada */ }
        activo = CE.juegos[juego.id].iniciar(escenario);
      });
    };
    pintar();
    activo = { idioma: pintar };
  }

  document.addEventListener('idioma', () => {
    if (!juego) return pintarLista();
    // Al cambiar de idioma dentro de un juego: actualiza la barra y avisa al juego
    sala.querySelector('.juego-barra a').textContent = `← ${CE.t('sala.volver')}`;
    sala.querySelector('.juego-barra h1').textContent = `${juego.icono} ${CE.tx(juego, 'nombre')}`;
    activo?.idioma?.();
  });

  if (juego) {
    document.title = `${CE.tx(juego, 'nombre')} · ${datos.ajustes.nombre}`;
    pintarJuego();
  }
  CE.aplicarIdioma();
})();
