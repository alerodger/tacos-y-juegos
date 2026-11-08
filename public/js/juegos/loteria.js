// Lotería: el bingo mexicano con cartas propias (emoji + nombre en español y alemán).
// Un móvil "canta" las cartas; cada jugador marca su tablero de 4×4 en su propio móvil.
CE.juegos.loteria = {
  iniciar(escenario) {
    const ac = new AbortController();
    const CARTAS = [
      ['☀️', 'El sol', 'die Sonne'], ['🌙', 'La luna', 'der Mond'], ['⭐', 'La estrella', 'der Stern'],
      ['❤️', 'El corazón', 'das Herz'], ['🧜‍♀️', 'La sirena', 'die Meerjungfrau'], ['🐓', 'El gallo', 'der Hahn'],
      ['🌵', 'El nopal', 'der Kaktus'], ['💀', 'La calavera', 'der Totenkopf'], ['🤠', 'El sombrero', 'der Hut'],
      ['🍾', 'La botella', 'die Flasche'], ['🌮', 'El taco', 'der Taco'], ['🥑', 'El aguacate', 'die Avocado'],
      ['🌶️', 'El chile', 'die Chili'], ['🍍', 'La piña', 'die Ananas'], ['🍋', 'El limón', 'die Zitrone'],
      ['🍉', 'La sandía', 'die Wassermelone'], ['🌽', 'El maíz', 'der Mais'], ['🍺', 'La cerveza', 'das Bier'],
      ['🥃', 'El tequila', 'der Tequila'], ['🍹', 'La margarita', 'die Margarita'], ['🌯', 'El burrito', 'der Burrito'],
      ['🎸', 'La guitarra', 'die Gitarre'], ['🎺', 'La trompeta', 'die Trompete'], ['🥁', 'El tambor', 'die Trommel'],
      ['🌹', 'La rosa', 'die Rose'], ['🌳', 'El árbol', 'der Baum'], ['🕷️', 'La araña', 'die Spinne'],
      ['🦂', 'El alacrán', 'der Skorpion'], ['🐟', 'El pescado', 'der Fisch'], ['🐢', 'La tortuga', 'die Schildkröte'],
      ['🦐', 'El camarón', 'die Garnele'], ['🐦', 'El pájaro', 'der Vogel'], ['🐕', 'El perro', 'der Hund'],
      ['🐈', 'El gato', 'die Katze'], ['🐎', 'El caballo', 'das Pferd'], ['🐄', 'La vaca', 'die Kuh'],
      ['🦅', 'El águila', 'der Adler'], ['✋', 'La mano', 'die Hand'], ['👢', 'La bota', 'der Stiefel'],
      ['⛵', 'El barco', 'das Boot'], ['🌊', 'La ola', 'die Welle'], ['🌎', 'El mundo', 'die Welt'],
      ['🔔', 'La campana', 'die Glocke'], ['☂️', 'El paraguas', 'der Regenschirm'], ['🔑', 'La llave', 'der Schlüssel'],
      ['👑', 'La corona', 'die Krone'], ['😈', 'El diablito', 'das Teufelchen'], ['👼', 'El angelito', 'das Engelchen'],
      ['🚲', 'La bicicleta', 'das Fahrrad'], ['🚀', 'El cohete', 'die Rakete'], ['⏰', 'El reloj', 'die Uhr'],
      ['🪅', 'La piñata', 'die Piñata'], ['🌋', 'El volcán', 'der Vulkan'], ['🦋', 'La mariposa', 'der Schmetterling'],
    ];
    const LINEAS = [];
    for (let i = 0; i < 4; i++) { LINEAS.push([0, 1, 2, 3].map((j) => i * 4 + j)); LINEAS.push([0, 1, 2, 3].map((j) => j * 4 + i)); }
    LINEAS.push([0, 5, 10, 15], [3, 6, 9, 12]);

    const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* nada */ } };
    const leer = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };

    let modo = 'tablero';
    let mazo = leer('ce-loteria-mazo') || { pila: CE.barajar(CARTAS.map((_, i) => i)), cantadas: [] };
    let tablero = leer('ce-loteria-tablero') || nuevoTablero();
    function nuevoTablero() { return { cartas: CE.barajar(CARTAS.map((_, i) => i)).slice(0, 16), marcadas: Array(16).fill(false) }; }
    const hayLoteria = () => LINEAS.some((l) => l.every((i) => tablero.marcadas[i]));

    const cartaHtml = (i, clase = '') => {
      const [emo, es, de] = CARTAS[i];
      return `<span class="lot-carta ${clase}"><span class="lot-num">${i + 1}</span><span class="lot-emo">${emo}</span><b>${es}</b><small>${de}</small></span>`;
    };

    function pintar() {
      const reglas = {
        es: 'Un móvil canta las cartas en voz alta (en español, ¡así se aprende!). Los demás marcan en su tablero. Quien complete una fila, columna o diagonal grita "¡Lotería!" y elige quién bebe.',
        de: 'Ein Handy ruft die Karten laut auf (auf Spanisch – so lernt man!). Die anderen markieren sie auf ihrem Brett. Wer eine Reihe, Spalte oder Diagonale voll hat, ruft „¡Lotería!" und bestimmt, wer trinkt.',
      };
      let cuerpo;
      if (modo === 'cantar') {
        const ultima = mazo.cantadas[mazo.cantadas.length - 1];
        cuerpo = `<div class="lot-cantar">
          ${ultima !== undefined ? cartaHtml(ultima, 'grande') : `<span class="lot-carta grande vacia"><span class="lot-emo">🎴</span></span>`}
          <p>${mazo.cantadas.length} / ${CARTAS.length}</p>
          <div class="cartas-botones">
            <button class="boton amarillo grande" type="button" data-cantar ${mazo.pila.length ? '' : 'disabled'}>📣 ${CE.L({ es: 'Siguiente carta', de: 'Nächste Karte' })}</button>
            <button class="boton contorno pequeno" type="button" data-barajar>🔀 ${CE.L({ es: 'Barajar de nuevo', de: 'Neu mischen' })}</button>
          </div>
          <div class="lot-historial">${mazo.cantadas.slice(-12, -1).reverse().map((i) => `<span title="${CARTAS[i][1]}">${CARTAS[i][0]}</span>`).join('')}</div>
        </div>`;
      } else {
        cuerpo = `<div class="lot-tablero ${hayLoteria() ? 'completo' : ''}">
          ${tablero.cartas.map((c, i) => `<button type="button" data-casilla="${i}" class="${tablero.marcadas[i] ? 'marcada' : ''}" aria-pressed="${tablero.marcadas[i]}">${cartaHtml(c)}</button>`).join('')}
        </div>
        ${hayLoteria() ? `<p class="lot-grito">🎉 ¡LOTERÍA! 🎉</p>` : ''}
        <button class="boton contorno pequeno" type="button" data-nuevo>🔀 ${CE.L({ es: 'Nuevo tablero', de: 'Neues Brett' })}</button>`;
      }
      escenario.innerHTML = `<div class="loteria">
        <div class="ah-modos" role="group">
          <button type="button" data-modo="tablero" aria-pressed="${modo === 'tablero'}">🎴 ${CE.L({ es: 'Mi tablero', de: 'Mein Brett' })}</button>
          <button type="button" data-modo="cantar" aria-pressed="${modo === 'cantar'}">📣 ${CE.L({ es: 'Cantar cartas', de: 'Karten ausrufen' })}</button>
        </div>
        <p class="cartas-reglas">${CE.L(reglas)}</p>
        ${cuerpo}
        ${CE.pieBeber()}
      </div>`;
    }

    escenario.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.modo) modo = b.dataset.modo;
      else if (b.dataset.casilla) { const i = Number(b.dataset.casilla); tablero.marcadas[i] = !tablero.marcadas[i]; guardar('ce-loteria-tablero', tablero); }
      else if ('nuevo' in b.dataset) { tablero = nuevoTablero(); guardar('ce-loteria-tablero', tablero); }
      else if ('cantar' in b.dataset && mazo.pila.length) { mazo.cantadas.push(mazo.pila.pop()); guardar('ce-loteria-mazo', mazo); }
      else if ('barajar' in b.dataset) { mazo = { pila: CE.barajar(CARTAS.map((_, i) => i)), cantadas: [] }; guardar('ce-loteria-mazo', mazo); }
      else return;
      pintar();
    }, { signal: ac.signal });

    pintar();
    return { idioma: pintar, destruir: () => ac.abort() };
  },
};
