// Adivina la palabra: una persona se pone el móvil en la frente y el resto le da pistas.
// 60 segundos por equipo. La palabra sale en español con la traducción debajo.
CE.juegos.adivina = {
  iniciar(escenario) {
    const ac = new AbortController();
    const SEGUNDOS = 60;
    const MAZOS = {
      comida: { ico: '🌮', nombre: { es: 'Comida y bebida', de: 'Essen & Trinken' }, palabras: CE.palabras.filter((p) => ['comida', 'bebida', 'mesa'].includes(p.cat)) },
      mexico: { ico: '🇲🇽', nombre: { es: 'México', de: 'Mexiko' }, palabras: [
        ...CE.palabras.filter((p) => p.cat === 'mexico'),
        { es: 'mariachi', de: 'Mariachi-Band' }, { es: 'piñata', de: 'Piñata' }, { es: 'tequila', de: 'Tequila' },
        { es: 'Día de Muertos', de: 'Tag der Toten' }, { es: 'luchador', de: 'Wrestler' }, { es: 'pirámide', de: 'Pyramide' },
        { es: 'desierto', de: 'Wüste' }, { es: 'volcán', de: 'Vulkan' }, { es: 'poncho', de: 'Poncho' }, { es: 'maracas', de: 'Rasseln' },
      ] },
      mimica: { ico: '🎭', nombre: { es: 'Mímica (sin hablar)', de: 'Pantomime (ohne Reden)' }, palabras: [
        { es: 'bailar salsa', de: 'Salsa tanzen' }, { es: 'cocinar tacos', de: 'Tacos kochen' }, { es: 'nadar', de: 'schwimmen' },
        { es: 'dormir', de: 'schlafen' }, { es: 'conducir', de: 'Auto fahren' }, { es: 'pedir la cuenta', de: 'die Rechnung verlangen' },
        { es: 'romper una piñata', de: 'eine Piñata zerschlagen' }, { es: 'tocar la guitarra', de: 'Gitarre spielen' },
        { es: 'hacer un selfie', de: 'ein Selfie machen' }, { es: 'brindar', de: 'anstoßen' }, { es: 'comer picante', de: 'scharf essen' },
        { es: 'llorar', de: 'weinen' }, { es: 'correr', de: 'rennen' }, { es: 'pescar', de: 'angeln' }, { es: 'cantar', de: 'singen' },
        { es: 'surfear', de: 'surfen' }, { es: 'cortar cebolla', de: 'Zwiebeln schneiden' }, { es: 'enamorarse', de: 'sich verlieben' },
      ] },
      animales: { ico: '🐾', nombre: { es: 'Animales', de: 'Tiere' }, palabras: [
        { es: 'perro', de: 'Hund' }, { es: 'gato', de: 'Katze' }, { es: 'caballo', de: 'Pferd' }, { es: 'vaca', de: 'Kuh' },
        { es: 'gallo', de: 'Hahn' }, { es: 'burro', de: 'Esel' }, { es: 'tortuga', de: 'Schildkröte' }, { es: 'águila', de: 'Adler' },
        { es: 'serpiente', de: 'Schlange' }, { es: 'tiburón', de: 'Hai' }, { es: 'ballena', de: 'Wal' }, { es: 'mariposa', de: 'Schmetterling' },
        { es: 'mono', de: 'Affe' }, { es: 'cerdo', de: 'Schwein' }, { es: 'oso', de: 'Bär' }, { es: 'conejo', de: 'Hase' },
      ] },
    };
    let mazo = null; let pila; let actual; let fin; let tic; let lista; let estado = 'elegir';

    function pintar() {
      if (estado === 'elegir') {
        escenario.innerHTML = `<div class="adivina">
          <p class="cartas-reglas">${CE.L({ es: 'Por equipos. Uno se pone el móvil en la frente mirando hacia los demás; su equipo le da pistas sin decir la palabra. ¡60 segundos!', de: 'In Teams. Eine Person hält das Handy an die Stirn (Bildschirm zu den anderen); ihr Team erklärt, ohne das Wort zu sagen. 60 Sekunden!' })}</p>
          <div class="adv-mazos">${Object.entries(MAZOS).map(([k, m]) =>
            `<button type="button" class="ficha" data-mazo="${k}"><span class="ficha-icono">${m.ico}</span><span class="ficha-texto"><b>${CE.L(m.nombre)}</b></span><span class="ficha-flecha">▶</span></button>`).join('')}</div>
          ${CE.pieBeber()}
        </div>`;
      } else if (estado === 'jugando') {
        const quedan = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
        escenario.innerHTML = `<div class="adivina jugando">
          <div class="adv-reloj ${quedan <= 10 ? 'urgente' : ''}">⏱️ ${quedan}</div>
          <div class="adv-palabra"><b>${CE.esc(actual.es)}</b><small>${CE.bandera('de')} ${CE.esc(actual.de)}</small></div>
          <div class="adv-botones">
            <button type="button" class="adv-paso" data-res="0">⏭ ${CE.L({ es: 'Paso', de: 'Weiter' })}</button>
            <button type="button" class="adv-ok" data-res="1">✅ ${CE.L({ es: '¡Acertada!', de: 'Erraten!' })}</button>
          </div>
        </div>`;
      } else {
        const puntos = lista.filter((x) => x.ok).length;
        escenario.innerHTML = `<div class="adivina">
          <h2 class="cub-titulo">⏰ ${CE.L({ es: '¡Tiempo!', de: 'Zeit ist um!' })} · ${puntos} ✅</h2>
          <ul class="adv-lista">${lista.map((x) => `<li class="${x.ok ? 'ok' : ''}">${x.ok ? '✅' : '⏭'} <b>${CE.esc(x.p.es)}</b> = ${CE.esc(x.p.de)}</li>`).join('')}</ul>
          <p class="cub-perdedor">🍻 ${CE.L({ es: 'El equipo con menos aciertos al final de la ronda… ¡bebe!', de: 'Das Team mit den wenigsten Treffern am Ende der Runde… trinkt!' })}</p>
          <div class="cartas-botones">
            <button class="boton amarillo" type="button" data-otra>▶ ${CE.L({ es: 'Siguiente equipo', de: 'Nächstes Team' })}</button>
            <button class="boton contorno pequeno" type="button" data-cambiar>🗂️ ${CE.L({ es: 'Otra categoría', de: 'Andere Kategorie' })}</button>
          </div>
        </div>`;
      }
    }

    function siguiente() {
      if (!pila.length) pila = CE.barajar(MAZOS[mazo].palabras);
      actual = pila.pop();
    }
    function empezar() {
      pila = CE.barajar(MAZOS[mazo].palabras); lista = []; estado = 'jugando';
      fin = Date.now() + SEGUNDOS * 1000;
      siguiente(); pintar();
      clearInterval(tic);
      tic = setInterval(() => {
        if (Date.now() >= fin) { clearInterval(tic); estado = 'fin'; navigator.vibrate?.([200, 100, 200]); pintar(); return; }
        const r = escenario.querySelector('.adv-reloj');
        if (r) { const q = Math.ceil((fin - Date.now()) / 1000); r.textContent = `⏱️ ${q}`; r.classList.toggle('urgente', q <= 10); }
      }, 250);
    }

    escenario.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.mazo) { mazo = b.dataset.mazo; empezar(); }
      else if (b.dataset.res && estado === 'jugando') { lista.push({ p: actual, ok: b.dataset.res === '1' }); siguiente(); pintar(); }
      else if ('otra' in b.dataset) empezar();
      else if ('cambiar' in b.dataset) { estado = 'elegir'; pintar(); }
    }, { signal: ac.signal });

    pintar();
    return { idioma: pintar, destruir: () => { ac.abort(); clearInterval(tic); } };
  },
};
