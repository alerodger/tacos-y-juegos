// Ahorcado bilingüe: adivinar la palabra en español (pista en alemán) o al revés.
// La cabeza del ahorcado es la cara del jefe.
CE.juegos.ahorcado = {
  iniciar(escenario) {
    const VIDAS = 6;
    const TECLADOS = { es: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', de: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ' };
    // Por defecto se aprende el otro idioma: web en alemán → adivinar en español
    let modo = CE.idioma === 'de' ? 'es' : 'de';
    let bolsa, palabra, usadas, fallos, puntos, acertadas, estado;

    // Letra "base" para comparar: en español Á = A (salvo Ñ); en alemán Ä/Ö/Ü cuentan aparte
    const base = (ch) => {
      const c = ch.toUpperCase();
      if (c === 'Ñ' || (modo === 'de' && 'ÄÖÜ'.includes(c))) return c;
      return c.normalize('NFD').replace(/[̀-ͯ]/g, '');
    };
    const esLetra = (ch) => /\p{L}/u.test(ch);
    const objetivo = () => palabra[modo];
    const pista = () => palabra[modo === 'es' ? 'de' : 'es'];
    const letrasQueFaltan = () => [...objetivo()].filter((ch) => esLetra(ch) && !usadas.has(base(ch)));

    function nuevaPartida() {
      bolsa = CE.barajar(CE.palabras);
      puntos = 0; acertadas = 0;
      nuevaPalabra();
    }
    function nuevaPalabra() {
      if (!bolsa.length) bolsa = CE.barajar(CE.palabras);
      palabra = bolsa.pop();
      usadas = new Set(); fallos = 0; estado = 'jugando';
      pintar();
    }

    function probar(letra) {
      if (estado !== 'jugando' || usadas.has(letra)) return;
      usadas.add(letra);
      const acierto = [...objetivo()].some((ch) => esLetra(ch) && base(ch) === letra);
      if (!acierto) fallos++;
      if (!letrasQueFaltan().length) {
        estado = 'ganada'; acertadas++;
        puntos += 10 + 5 * (VIDAS - fallos);
      } else if (fallos >= VIDAS) {
        estado = 'perdida';
      }
      pintar(acierto ? null : letra);
    }

    function dibujo() {
      const partes = [
        CE.jefeEnSvg(140, 70, 40, 'ah'),
        '<line x1="140" y1="92" x2="140" y2="140"/>',
        '<line x1="140" y1="104" x2="120" y2="126"/>',
        '<line x1="140" y1="104" x2="160" y2="126"/>',
        '<line x1="140" y1="140" x2="124" y2="172"/>',
        '<line x1="140" y1="140" x2="156" y2="172"/>',
      ];
      return `<svg viewBox="0 0 200 200" class="ah-dibujo ${estado}" aria-hidden="true">
        <g class="ah-horca"><line x1="20" y1="188" x2="110" y2="188"/><line x1="50" y1="188" x2="50" y2="18"/>
          <line x1="46" y1="20" x2="146" y2="20"/><line x1="50" y1="52" x2="82" y2="20"/>
          <line class="cuerda" x1="140" y1="20" x2="140" y2="48"/></g>
        <g class="ah-cuerpo">${partes.slice(0, fallos).join('')}</g>
        ${estado === 'ganada' ? `<g class="ah-salvado">${CE.jefeEnSvg(140, 150, 56, 'ah2')}<text x="140" y="60" text-anchor="middle">¡Olé!</text></g>` : ''}
      </svg>`;
    }

    function pintar(letraFallada) {
      const revelar = estado !== 'jugando';
      const cajas = [...objetivo()].map((ch) => {
        if (ch === ' ') return '<span class="ah-hueco"></span>';
        if (!esLetra(ch)) return `<span class="ah-letra visible">${CE.esc(ch)}</span>`;
        const vista = usadas.has(base(ch));
        const cls = vista ? 'visible' : revelar ? 'visible faltaba' : '';
        return `<span class="ah-letra ${cls}">${vista || revelar ? CE.esc(ch.toUpperCase()) : ''}</span>`;
      }).join('');

      const teclas = [...TECLADOS[modo]].map((l) => {
        const usada = usadas.has(l);
        const bien = usada && [...objetivo()].some((ch) => esLetra(ch) && base(ch) === l);
        return `<button type="button" data-l="${l}" ${usada || estado !== 'jugando' ? 'disabled' : ''}
          class="${usada ? (bien ? 'bien' : 'mal') : ''}">${l}</button>`;
      }).join('');

      const mensaje = estado === 'ganada'
        ? `<p class="ah-msg bien">🎉 ${CE.t('ahorcado.acierto')} <span>${CE.esc(objetivo())} = ${CE.esc(pista())}</span></p>
           <button class="boton amarillo" data-sig type="button">${CE.t('ahorcado.siguiente')} →</button>`
        : estado === 'perdida'
          ? `<p class="ah-msg mal">💀 ${CE.t('ahorcado.fallo')} <b>${CE.esc(objetivo())}</b> <span>(${CE.esc(pista())})</span></p>
             <button class="boton" data-fin type="button">${CE.t('ahorcado.terminar')}</button>`
          : '';

      escenario.innerHTML = `
        <div class="ahorcado">
          <div class="ah-modos" role="group">
            ${['es', 'de'].map((m) => `<button type="button" data-modo="${m}" aria-pressed="${m === modo}">${CE.bandera(m)} ${CE.t(`ahorcado.modo.${m}`)}</button>`).join('')}
          </div>
          <div class="ah-marcador">
            <span>${CE.t('ahorcado.palabras')}: <b>${acertadas}</b></span>
            <span>${CE.t('ahorcado.puntos')}: <b>${puntos}</b></span>
            <span aria-label="${CE.t('ahorcado.vidas')}: ${VIDAS - fallos}">${'❤️'.repeat(VIDAS - fallos)}${'🖤'.repeat(fallos)}</span>
          </div>
          ${dibujo()}
          <p class="ah-pista"><span class="ah-cat">${CE.t(`pal.${palabra.cat}`)}</span>
            ${CE.t('ahorcado.pista')}: ${CE.bandera(modo === 'es' ? 'de' : 'es')} <b>${CE.esc(pista())}</b></p>
          <div class="ah-palabra ${letraFallada ? 'tiembla' : ''}" aria-live="polite">${cajas}</div>
          <div class="ah-acciones">${mensaje}</div>
          <div class="ah-teclado ${modo}">${teclas}</div>
        </div>`;
      escenario.querySelector('[data-sig], [data-fin]')?.focus();
    }

    function alClic(e) {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.l) probar(t.dataset.l);
      else if (t.dataset.modo && t.dataset.modo !== modo) { modo = t.dataset.modo; nuevaPartida(); }
      else if ('sig' in t.dataset) nuevaPalabra();
      else if ('fin' in t.dataset) CE.finPartida(escenario, { juego: 'ahorcado', puntos, alOtra: nuevaPartida });
    }
    function alTeclear(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      const l = e.key.toUpperCase();
      if (TECLADOS[modo].includes(l)) probar(l);
    }

    escenario.addEventListener('click', alClic);
    document.addEventListener('keydown', alTeclear);
    nuevaPartida();

    return {
      idioma() { if (!escenario.querySelector('.fin-partida')) pintar(); },
      destruir() {
        escenario.removeEventListener('click', alClic);
        document.removeEventListener('keydown', alTeclear);
      },
    };
  },
};
