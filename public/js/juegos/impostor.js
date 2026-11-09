// El Impostor: todos ven la palabra secreta en su turno… menos el impostor (o los impostores).
// El móvil se pasa de mano en mano; luego se debate y se revela quién era.
CE.juegos.impostor = {
  iniciar(escenario) {
    const W = (es, de) => ({ es, de });
    const CATEGORIAS = {
      comida: { ico: '🌮', nombre: W('Comida mexicana', 'Mexikanisches Essen'), palabras: [
        W('tacos', 'Tacos'), W('burrito', 'Burrito'), W('guacamole', 'Guacamole'), W('nachos', 'Nachos'), W('quesadilla', 'Quesadilla'),
        W('enchiladas', 'Enchiladas'), W('churros', 'Churros'), W('tamales', 'Tamales'), W('mole', 'Mole'), W('elote', 'Maiskolben'),
        W('fajitas', 'Fajitas'), W('ceviche', 'Ceviche'), W('chilaquiles', 'Chilaquiles'), W('frijoles', 'Bohnen'), W('salsa', 'Salsa')] },
      bebida: { ico: '🍹', nombre: W('Bebidas', 'Getränke'), palabras: [
        W('tequila', 'Tequila'), W('mezcal', 'Mezcal'), W('margarita', 'Margarita'), W('cerveza', 'Bier'), W('michelada', 'Michelada'),
        W('horchata', 'Horchata'), W('café', 'Kaffee'), W('vino tinto', 'Rotwein'), W('mojito', 'Mojito'), W('limonada', 'Limonade'),
        W('agua con gas', 'Sprudelwasser'), W('chupito', 'Shot'), W('piña colada', 'Piña Colada'), W('aperol spritz', 'Aperol Spritz')] },
      lugares: { ico: '📍', nombre: W('Lugares', 'Orte'), palabras: [
        W('playa', 'Strand'), W('pirámide', 'Pyramide'), W('mercado', 'Markt'), W('cementerio', 'Friedhof'), W('desierto', 'Wüste'),
        W('discoteca', 'Disco'), W('aeropuerto', 'Flughafen'), W('biblioteca', 'Bibliothek'), W('gimnasio', 'Fitnessstudio'),
        W('hospital', 'Krankenhaus'), W('cine', 'Kino'), W('estadio', 'Stadion'), W('universidad', 'Universität'), W('Danubio', 'Donau')] },
      cantina: { ico: '🍻', nombre: W('En la cantina', 'In der Cantina'), palabras: [
        W('barra', 'Theke'), W('camarero', 'Kellner'), W('cuenta', 'Rechnung'), W('propina', 'Trinkgeld'), W('karaoke', 'Karaoke'),
        W('mariachi', 'Mariachi'), W('piñata', 'Piñata'), W('sombrero', 'Sombrero'), W('servilleta', 'Serviette'), W('hielo', 'Eis'),
        W('lima', 'Limette'), W('sal', 'Salz'), W('vela', 'Kerze'), W('reserva', 'Reservierung')] },
      animales: { ico: '🦎', nombre: W('Animales', 'Tiere'), palabras: [
        W('burro', 'Esel'), W('gallo', 'Hahn'), W('águila', 'Adler'), W('jaguar', 'Jaguar'), W('serpiente', 'Schlange'),
        W('tortuga', 'Schildkröte'), W('iguana', 'Leguan'), W('ajolote', 'Axolotl'), W('ballena', 'Wal'), W('tiburón', 'Hai'),
        W('mariposa', 'Schmetterling'), W('perro', 'Hund'), W('loro', 'Papagei'), W('escorpión', 'Skorpion')] },
    };

    return CE.conJugadores(escenario, 3, (esc, jugadores, cambiarJugadores) => {
      const ac = new AbortController();
      const maxImpostores = Math.max(1, Math.floor((jugadores.length - 1) / 2));
      let cfg = { cat: 'mezcla', impostores: 1, pista: true };
      let estado = 'config'; let ronda = null; let turno = 0; let tic; let finDebate = 0;

      function repartir() {
        const cats = cfg.cat === 'mezcla' ? Object.keys(CATEGORIAS) : [cfg.cat];
        const cat = CE.azar(cats);
        const imp = new Set(CE.barajar(jugadores.map((_, i) => i)).slice(0, Math.min(cfg.impostores, maxImpostores)));
        ronda = { cat, palabra: CE.azar(CATEGORIAS[cat].palabras), impostores: imp, empieza: CE.azar(jugadores) };
        turno = 0; estado = 'pasar'; pintar();
      }
      const palabra = (w) => `<b class="imp-palabra">${CE.esc(CE.idioma === 'de' ? w.de : w.es)}</b>
        <small>${CE.bandera(CE.idioma === 'de' ? 'es' : 'de')} ${CE.esc(CE.idioma === 'de' ? w.es : w.de)}</small>`;

      function pintar() {
        const L = CE.L;
        let html = '';
        if (estado === 'config') {
          html = `<p class="cartas-reglas">${L({ es: 'Todos reciben la misma palabra secreta menos el impostor. Por turnos, cada uno dice UNA palabra relacionada sin decirla. El impostor tiene que disimular… y adivinarla.',
            de: 'Alle bekommen dasselbe geheime Wort – außer dem Impostor. Reihum sagt jeder EIN passendes Wort, ohne es zu verraten. Der Impostor muss bluffen… und das Wort erraten.' })}</p>
            <div class="imp-ajustes">
              <p class="imp-titulo">${L({ es: 'Categoría', de: 'Kategorie' })}</p>
              <div class="ah-modos" role="group">
                <button type="button" data-cat="mezcla" aria-pressed="${cfg.cat === 'mezcla'}">🎲 ${L({ es: 'De todo', de: 'Gemischt' })}</button>
                ${Object.entries(CATEGORIAS).map(([k, c]) => `<button type="button" data-cat="${k}" aria-pressed="${cfg.cat === k}">${c.ico} ${L(c.nombre)}</button>`).join('')}
              </div>
              <p class="imp-titulo">${L({ es: 'Impostores', de: 'Impostoren' })}</p>
              <div class="imp-contador">
                <button type="button" data-imp="-1" ${cfg.impostores <= 1 ? 'disabled' : ''} aria-label="−">−</button>
                <b>${cfg.impostores} 🕵️</b>
                <button type="button" data-imp="1" ${cfg.impostores >= maxImpostores ? 'disabled' : ''} aria-label="+">+</button>
              </div>
              <label class="rk-consiente imp-pista"><input type="checkbox" data-pista ${cfg.pista ? 'checked' : ''}>
                <span>${L({ es: 'El impostor ve la categoría como pista', de: 'Der Impostor sieht die Kategorie als Tipp' })}</span></label>
            </div>
            <p class="cartas-turno">👥 ${jugadores.map(CE.esc).join(' · ')}</p>
            <div class="cartas-botones">
              <button class="boton amarillo grande" type="button" data-repartir>🃏 ${L({ es: 'Repartir papeles', de: 'Rollen verteilen' })}</button>
              <button class="boton contorno pequeno" type="button" data-jugadores>👥 ${CE.t('jug.cambiar')}</button>
            </div>`;
        } else if (estado === 'pasar' || estado === 'ver') {
          const nombre = CE.esc(jugadores[turno]);
          const esImp = ronda.impostores.has(turno);
          html = estado === 'pasar'
            ? `<div class="imp-pasar">
                <p class="imp-paso">${turno + 1} / ${jugadores.length}</p>
                <p>${L({ es: 'Pasa el móvil a', de: 'Gib das Handy an' })}</p>
                <h2 class="imp-nombre">${nombre}</h2>
                <p class="cartas-reglas">${L({ es: '¡Que no mire nadie más!', de: 'Niemand sonst darf hinschauen!' })}</p>
                <button class="boton amarillo grande" type="button" data-ver>👀 ${L({ es: 'Ver mi papel', de: 'Meine Rolle ansehen' })}</button>
              </div>`
            : `<div class="imp-carta ${esImp ? 'impostor' : ''}">
                ${esImp
                  ? `<span class="imp-icono">🕵️</span><b class="imp-palabra">${L({ es: '¡Eres el impostor!', de: 'Du bist der Impostor!' })}</b>
                     ${cfg.pista ? `<small>${L({ es: 'Pista', de: 'Tipp' })}: ${CATEGORIAS[ronda.cat].ico} ${L(CATEGORIAS[ronda.cat].nombre)}</small>` : `<small>${L({ es: 'Sin pistas. ¡Disimula!', de: 'Kein Tipp. Bluffe!' })}</small>`}`
                  : `<span class="imp-icono">${CATEGORIAS[ronda.cat].ico}</span><small>${L({ es: 'La palabra secreta es', de: 'Das geheime Wort ist' })}</small>${palabra(ronda.palabra)}`}
              </div>
              <button class="boton grande" type="button" data-visto>🙈 ${turno < jugadores.length - 1 ? L({ es: 'Ocultar y pasar', de: 'Verdecken & weitergeben' }) : L({ es: 'Ocultar y empezar', de: 'Verdecken & loslegen' })}</button>`;
        } else if (estado === 'debate') {
          const resta = Math.max(0, Math.ceil((finDebate - Date.now()) / 1000));
          html = `<div class="imp-debate">
              <span class="imp-icono">🗣️</span>
              <h2>${L({ es: '¡A debatir!', de: 'Diskutiert!' })}</h2>
              <p>${L({ es: 'Empieza', de: 'Es beginnt' })} <b>${CE.esc(ronda.empieza)}</b>. ${L({ es: 'Por turnos, cada uno dice una palabra relacionada. Después, votad a la de tres señalando a quien creéis que es el impostor.',
                de: 'Reihum sagt jeder ein passendes Wort. Danach zeigt auf drei auf die Person, die ihr für den Impostor haltet.' })}</p>
              ${finDebate ? `<p class="imp-reloj" data-reloj>${Math.floor(resta / 60)}:${String(resta % 60).padStart(2, '0')}</p>`
                : `<button class="boton contorno pequeno" type="button" data-reloj-iniciar>⏱️ ${L({ es: 'Cuenta atrás de 3 minutos', de: '3-Minuten-Countdown' })}</button>`}
              <button class="boton amarillo grande" type="button" data-revelar>🎭 ${L({ es: 'Revelar al impostor', de: 'Impostor aufdecken' })}</button>
            </div>`;
        } else {
          const nombres = [...ronda.impostores].map((i) => `<b>${CE.esc(jugadores[i])}</b>`).join(' & ');
          html = `<div class="imp-debate">
              <span class="imp-icono">🕵️</span>
              <h2>${ronda.impostores.size > 1 ? L({ es: 'Los impostores eran', de: 'Die Impostoren waren' }) : L({ es: 'El impostor era', de: 'Der Impostor war' })}</h2>
              <p class="imp-revelado">${nombres}</p>
              <div class="imp-carta mini"><small>${L({ es: 'La palabra era', de: 'Das Wort war' })}</small>${palabra(ronda.palabra)}</div>
              <p class="cartas-reglas">${CE.beber.activo()
                ? L({ es: '🍻 ¿Le pillasteis? El impostor bebe. ¿Se os escapó o adivinó la palabra? ¡Bebe toda la mesa!', de: '🍻 Erwischt? Der Impostor trinkt. Entwischt oder Wort erraten? Der ganze Tisch trinkt!' })
                : L({ es: '¿Le pillasteis? Punto para el grupo. ¿Se os escapó o adivinó la palabra? Gana el impostor.', de: 'Erwischt? Punkt für die Gruppe. Entwischt oder Wort erraten? Der Impostor gewinnt.' })}</p>
              <div class="cartas-botones">
                <button class="boton amarillo" type="button" data-repartir>🔁 ${L({ es: 'Otra ronda', de: 'Neue Runde' })}</button>
                <button class="boton contorno pequeno" type="button" data-ajustes>⚙️ ${L({ es: 'Ajustes', de: 'Einstellungen' })}</button>
              </div>
            </div>`;
        }
        esc.innerHTML = `<div class="impostor">${html}${CE.beber.activo() ? CE.pieBeber() : ''}</div>`;
      }

      esc.addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.cat) { cfg.cat = b.dataset.cat; pintar(); }
        else if (b.dataset.imp) { cfg.impostores = Math.min(maxImpostores, Math.max(1, cfg.impostores + Number(b.dataset.imp))); pintar(); }
        else if ('repartir' in b.dataset) { clearInterval(tic); finDebate = 0; repartir(); }
        else if ('ver' in b.dataset) { estado = 'ver'; pintar(); }
        else if ('visto' in b.dataset) { turno++; estado = turno < jugadores.length ? 'pasar' : 'debate'; pintar(); }
        else if ('relojIniciar' in b.dataset) {
          finDebate = Date.now() + 180000; pintar();
          tic = setInterval(() => {
            const r = esc.querySelector('[data-reloj]'); if (!r) return;
            const q = Math.max(0, Math.ceil((finDebate - Date.now()) / 1000));
            r.textContent = `${Math.floor(q / 60)}:${String(q % 60).padStart(2, '0')}`;
            if (!q) { clearInterval(tic); navigator.vibrate?.([200, 100, 200]); }
          }, 250);
        } else if ('revelar' in b.dataset) { clearInterval(tic); estado = 'revelar'; pintar(); }
        else if ('ajustes' in b.dataset) { estado = 'config'; pintar(); }
        else if ('jugadores' in b.dataset) { ac.abort(); clearInterval(tic); cambiarJugadores(); }
      }, { signal: ac.signal });
      esc.addEventListener('change', (e) => { if (e.target.matches('[data-pista]')) cfg.pista = e.target.checked; }, { signal: ac.signal });
      pintar();
      return { idioma: pintar, destruir: () => { ac.abort(); clearInterval(tic); } };
    });
  },
};
