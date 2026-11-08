// Pirinola "Toma todo": la peonza de seis caras mexicana, en versión para brindar.
CE.juegos.pirinola = {
  iniciar(escenario) {
    const CARAS = [
      { cara: 'TOMA 1', c: '#e8407c', es: 'Bebe 1 trago', de: 'Trink 1 Schluck' },
      { cara: 'TOMA 2', c: '#d7263d', es: 'Bebe 2 tragos', de: 'Trink 2 Schlucke' },
      { cara: 'PON 1', c: '#0e9aa7', es: 'Reparte 1 trago a quien quieras', de: 'Verteile 1 Schluck an wen du willst' },
      { cara: 'PON 2', c: '#2e9e5b', es: 'Reparte 2 tragos a quien quieras', de: 'Verteile 2 Schlucke an wen du willst' },
      { cara: 'TODOS PONEN', c: '#6b3fa0', es: '¡Todos beben! ¡Salud!', de: 'Alle trinken! ¡Salud!' },
      { cara: 'TOMA TODO', c: '#f6a21e', es: '¡Toma todo! Acaba tu vaso… y pide otro 😉', de: '¡Toma todo! Trink dein Glas aus… und bestell ein neues 😉' },
    ];
    const REGLAS = {
      es: 'La peonza clásica de México. Por turnos, gira la pirinola y haz lo que diga su cara.',
      de: 'Der mexikanische Kreisel-Klassiker. Reihum drehen und tun, was oben steht.',
    };

    return CE.conJugadores(escenario, 2, (esc, jugadores, cambiarJugadores) => {
      const ac = new AbortController();
      let turno = 0; let resultado = null; let girando = false; let timer;
      // Texto de la cara: en dos líneas si es largo ("TODOS / PONEN")
      const caraSvg = (txt) => {
        const lineas = txt.length > 7 ? txt.split(' ') : [txt];
        return lineas.map((l, i) => `<text class="pir-cara" x="100" y="${108 + (i - (lineas.length - 1) / 2) * 26}" text-anchor="middle">${l}</text>`).join('');
      };

      function pintar() {
        const r = resultado;
        esc.innerHTML = `<div class="pirinola">
          <p class="cartas-reglas">${CE.L(REGLAS)}</p>
          <p class="cartas-turno">${CE.t('jug.turno')}: <b>${CE.esc(jugadores[turno])}</b></p>
          <svg class="pir-svg ${girando ? 'girando' : ''}" viewBox="0 0 200 240" aria-hidden="true">
            <rect x="90" y="4" width="20" height="46" rx="8" fill="#8a5a2b"/>
            <polygon points="20,50 180,50 170,150 100,236 30,150" fill="${r ? r.c : '#f6a21e'}" stroke="#22180f" stroke-width="4"/>
            <polygon points="20,50 60,50 52,150 30,150" fill="rgba(0,0,0,.12)"/>
            <polygon points="140,50 180,50 170,150 148,150" fill="rgba(255,255,255,.18)"/>
            ${caraSvg(r ? r.cara : '¿?')}
          </svg>
          <p class="pir-resultado" aria-live="polite">${r && !girando ? CE.L(r) : '&nbsp;'}</p>
          <button class="boton amarillo grande" type="button" data-girar ${girando ? 'disabled' : ''}>🌀 ${CE.L({ es: '¡Gira!', de: 'Drehen!' })}</button>
          <button class="boton contorno pequeno" type="button" data-jugadores>👥 ${CE.t('jug.cambiar')}</button>
          ${CE.pieBeber()}
        </div>`;
      }

      function girar() {
        if (girando) return;
        if (resultado) turno = (turno + 1) % jugadores.length;
        girando = true;
        let pasos = 14 + Math.floor(Math.random() * 6);
        const paso = () => {
          resultado = CE.azar(CARAS);
          pasos--;
          if (pasos <= 0) { girando = false; pintar(); return; }
          pintar();
          timer = setTimeout(paso, 60 + (20 - pasos) * 12);
        };
        paso();
      }

      esc.addEventListener('click', (e) => {
        if (e.target.closest('[data-girar]')) girar();
        else if (e.target.closest('[data-jugadores]')) { ac.abort(); clearTimeout(timer); cambiarJugadores(); }
      }, { signal: ac.signal });
      pintar();
      return { idioma: pintar, destruir: () => { ac.abort(); clearTimeout(timer); } };
    });
  },
};
