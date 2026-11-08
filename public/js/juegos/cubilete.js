// Cubilete: el póker de dados de las cantinas mexicanas.
// Cinco dados con caras As, K, Q, J, 10 y 9. Hasta tres tiradas por turno; la peor mano invita o bebe.
CE.juegos.cubilete = {
  iniciar(escenario) {
    const CARAS = ['A', 'K', 'Q', 'J', '10', '9']; // índice menor = cara mejor
    const COLORES = ['#22180f', '#d7263d', '#2e9e5b', '#1f4e9c', '#d7263d', '#22180f'];
    const MANOS = [
      { es: 'Nada', de: 'Nichts' }, { es: 'Par', de: 'Paar' }, { es: 'Dos pares', de: 'Zwei Paare' },
      { es: 'Tercia', de: 'Drilling' }, { es: 'Corrida', de: 'Straße' }, { es: 'Full', de: 'Full House' },
      { es: 'Póker', de: 'Poker' }, { es: 'Quintilla', de: 'Fünfling' },
    ];
    const REGLAS = {
      es: 'Por turnos: tira los cinco dados hasta tres veces. Toca los dados que quieras guardar entre tirada y tirada. Cuando todos hayan jugado, la peor mano bebe… o invita la ronda.',
      de: 'Reihum: Wirf die fünf Würfel bis zu dreimal. Tippe zwischen den Würfen die Würfel an, die du behalten willst. Wenn alle dran waren, trinkt die schlechteste Hand… oder gibt eine Runde aus.',
    };

    // Valor de una mano: [tipo, desempates…] (tipo mayor gana; en desempate, cara menor gana)
    function valorar(dados) {
      const cuenta = Array(6).fill(0);
      dados.forEach((d) => cuenta[d]++);
      const grupos = cuenta.map((n, cara) => ({ n, cara })).filter((g) => g.n).sort((x, y) => y.n - x.n || x.cara - y.cara);
      const forma = grupos.map((g) => g.n).join('');
      const distintas = grupos.length === 5;
      const corrida = distintas && (cuenta[5] === 0 || cuenta[0] === 0);
      const tipo = forma === '5' ? 7 : forma === '41' ? 6 : forma === '32' ? 5 : corrida ? 4
        : forma === '311' ? 3 : forma === '221' ? 2 : forma === '2111' ? 1 : 0;
      return [tipo, ...grupos.map((g) => g.cara)];
    }
    const comparar = (a, b) => {
      if (a[0] !== b[0]) return b[0] - a[0];
      for (let i = 1; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) return (a[i] ?? 9) - (b[i] ?? 9);
      return 0;
    };

    return CE.conJugadores(escenario, 2, (esc, jugadores, cambiarJugadores) => {
      const ac = new AbortController();
      let turno, dados, fijos, tiradas, resultados, rodando = false;

      function nuevaRonda() { turno = 0; resultados = []; nuevoTurno(); }
      function nuevoTurno() { dados = [0, 1, 2, 3, 4].map(() => null); fijos = [false, false, false, false, false]; tiradas = 0; pintar(); }

      function tirar() {
        if (rodando || tiradas >= 3) return;
        rodando = true; tiradas++;
        let vueltas = 6;
        const animar = () => {
          dados = dados.map((d, i) => (fijos[i] && d !== null ? d : Math.floor(Math.random() * 6)));
          pintar();
          if (--vueltas > 0) setTimeout(animar, 70);
          else { rodando = false; if (tiradas >= 3) plantarse(); else pintar(); }
        };
        animar();
      }
      function plantarse() {
        resultados.push({ nombre: jugadores[turno], dados: [...dados], valor: valorar(dados) });
        turno++;
        if (turno >= jugadores.length) pintarResultados();
        else nuevoTurno();
      }

      const dadoHtml = (d, i, interactivo) => `<button type="button" class="dado ${fijos?.[i] ? 'fijo' : ''} ${rodando && !fijos[i] ? 'rueda' : ''}"
          ${interactivo ? `data-dado="${i}"` : 'disabled'} style="--c:${d === null ? '#ccc' : COLORES[d]}"
          aria-label="${d === null ? '?' : CARAS[d]}${fijos?.[i] ? ' ✓' : ''}">${d === null ? '?' : CARAS[d]}</button>`;

      function pintar() {
        const valor = tiradas ? valorar(dados) : null;
        const puedeFijar = tiradas > 0 && tiradas < 3 && !rodando;
        esc.innerHTML = `<div class="cubilete">
          <p class="cartas-reglas">${CE.L(REGLAS)}</p>
          <p class="cartas-turno">${CE.t('jug.turno')}: <b>${CE.esc(jugadores[turno])}</b> · ${CE.L({ es: 'Tirada', de: 'Wurf' })} ${tiradas}/3</p>
          <div class="dados">${dados.map((d, i) => dadoHtml(d, i, puedeFijar)).join('')}</div>
          <p class="cub-mano">${valor ? CE.L(MANOS[valor[0]]) : '&nbsp;'}</p>
          ${puedeFijar ? `<p class="cub-ayuda">${CE.L({ es: 'Toca los dados que quieras guardar', de: 'Tippe die Würfel an, die du behalten willst' })}</p>` : ''}
          <div class="cartas-botones">
            <button class="boton amarillo" type="button" data-tirar ${rodando || tiradas >= 3 ? 'disabled' : ''}>🎲 ${CE.L({ es: 'Tirar', de: 'Würfeln' })}</button>
            <button class="boton" type="button" data-plantarse ${!tiradas || rodando ? 'disabled' : ''}>✋ ${CE.L({ es: 'Me planto', de: 'Ich bleib' })}</button>
          </div>
          ${CE.pieBeber()}
        </div>`;
      }

      function pintarResultados() {
        const orden = [...resultados].sort((a, b) => comparar(a.valor, b.valor));
        const perdedor = orden[orden.length - 1];
        esc.innerHTML = `<div class="cubilete">
          <h2 class="cub-titulo">🏁 ${CE.L({ es: 'Resultado de la ronda', de: 'Ergebnis der Runde' })}</h2>
          <ol class="cub-tabla">${orden.map((r) => `<li class="${r === perdedor ? 'pierde' : ''}">
            <b>${CE.esc(r.nombre)}</b><span class="mini-dados">${r.dados.map((d) => `<i style="--c:${COLORES[d]}">${CARAS[d]}</i>`).join('')}</span>
            <span>${CE.L(MANOS[r.valor[0]])}</span></li>`).join('')}</ol>
          <p class="cub-perdedor">🍻 ${CE.L({ es: `${CE.esc(perdedor.nombre)} pierde: ¡bebe o invita la siguiente ronda!`, de: `${CE.esc(perdedor.nombre)} verliert: trinken oder die nächste Runde ausgeben!` })}</p>
          <div class="cartas-botones">
            <button class="boton amarillo" type="button" data-ronda>🔁 ${CE.L({ es: 'Otra ronda', de: 'Neue Runde' })}</button>
            <button class="boton contorno pequeno" type="button" data-jugadores>👥 ${CE.t('jug.cambiar')}</button>
          </div>
          ${CE.pieBeber()}
        </div>`;
      }

      esc.addEventListener('click', (e) => {
        const d = e.target.closest('[data-dado]');
        if (d) { fijos[d.dataset.dado] = !fijos[d.dataset.dado]; pintar(); return; }
        if (e.target.closest('[data-tirar]')) tirar();
        else if (e.target.closest('[data-plantarse]')) plantarse();
        else if (e.target.closest('[data-ronda]')) nuevaRonda();
        else if (e.target.closest('[data-jugadores]')) { ac.abort(); cambiarJugadores(); }
      }, { signal: ac.signal });
      nuevaRonda();
      return {
        idioma: () => (turno >= jugadores.length ? pintarResultados() : pintar()),
        destruir: () => ac.abort(),
      };
    });
  },
};
