// Memoria ES ↔ DE: empareja cada palabra en español con su traducción al alemán.
// 8 parejas. Puntos: más cuanto más rápido y con menos fallos.
CE.juegos.memoria = {
  iniciar(escenario) {
    const ac = new AbortController();
    const PAREJAS = 8;
    let cartas; let abiertas; let hechas; let fallos; let inicio; let tic; let bloqueado;

    function nueva() {
      const vistas = new Set();
      const elegidas = CE.barajar(CE.palabras).filter((p) => !vistas.has(p.es) && vistas.add(p.es)).slice(0, PAREJAS);
      cartas = CE.barajar(elegidas.flatMap((p, i) => [{ par: i, lado: 'es', txt: p.es, cat: p.cat }, { par: i, lado: 'de', txt: p.de, cat: p.cat }]));
      abiertas = []; hechas = new Set(); fallos = 0; inicio = 0; bloqueado = false;
      clearInterval(tic);
      pintar();
    }
    const segundos = () => (inicio ? Math.floor((Date.now() - inicio) / 1000) : 0);
    const calcular = () => Math.max(50, Math.round(1200 - segundos() * 8 - fallos * 20));

    function pintar() {
      escenario.innerHTML = `<div class="memoria">
        <p class="cartas-reglas">${CE.L({ es: 'Da la vuelta a dos cartas: busca cada palabra con su traducción. 🇲🇽 ↔ 🇩🇪', de: 'Deck zwei Karten auf: Finde zu jedem Wort die Übersetzung. 🇲🇽 ↔ 🇩🇪' })}</p>
        <div class="marcador-arcade"><span>⏱️ <b data-seg>${segundos()}</b></span><span>❌ <b>${fallos}</b></span><span>✅ <b>${hechas.size}/${PAREJAS}</b></span></div>
        <div class="mem-rejilla">${cartas.map((c, i) => {
          const vista = abiertas.includes(i) || hechas.has(c.par);
          return `<button type="button" class="mem-carta ${vista ? 'vista' : ''} ${hechas.has(c.par) ? 'hecha' : ''}" data-i="${i}" ${vista ? 'disabled' : ''}
            aria-label="${vista ? CE.esc(c.txt) : '?'}">
            <span class="mem-dorso" aria-hidden="true">🌵</span>
            <span class="mem-cara">${CE.bandera(c.lado)}<b>${CE.esc(c.txt)}</b></span>
          </button>`;
        }).join('')}</div>
      </div>`;
    }

    function voltear(i) {
      if (bloqueado || abiertas.includes(i) || hechas.has(cartas[i].par)) return;
      if (!inicio) {
        inicio = Date.now();
        tic = setInterval(() => { const s = escenario.querySelector('[data-seg]'); if (s) s.textContent = segundos(); }, 500);
      }
      abiertas.push(i);
      if (abiertas.length === 2) {
        const [a, b] = abiertas.map((k) => cartas[k]);
        if (a.par === b.par) {
          hechas.add(a.par); abiertas = [];
          if (hechas.size === PAREJAS) {
            clearInterval(tic); pintar();
            setTimeout(() => CE.finPartida(escenario, { juego: 'memoria', puntos: calcular(), alOtra: nueva }), 500);
            return;
          }
        } else {
          fallos++; bloqueado = true;
          setTimeout(() => { abiertas = []; bloqueado = false; pintar(); }, 900);
        }
      }
      pintar();
    }

    escenario.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (b) voltear(Number(b.dataset.i));
    }, { signal: ac.signal });
    nueva();
    return { idioma: () => { if (!escenario.querySelector('.fin-partida')) pintar(); }, destruir: () => { ac.abort(); clearInterval(tic); } };
  },
};
