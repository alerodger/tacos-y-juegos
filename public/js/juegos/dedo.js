// El dedo del destino: todos ponen un dedo en la pantalla y el móvil elige a uno.
CE.juegos.dedo = {
  iniciar(escenario) {
    const ac = new AbortController();
    const PREGUNTAS = [
      { es: '¿Quién invita la próxima ronda?', de: 'Wer gibt die nächste Runde aus?' },
      { es: '¿Quién bebe?', de: 'Wer trinkt?' },
      { es: '¿Quién empieza?', de: 'Wer fängt an?' },
      { es: '¿Quién pide el postre para todos?', de: 'Wer bestellt den Nachtisch für alle?' },
    ];
    const COLORES = ['#e8407c', '#f6a21e', '#0e9aa7', '#2e9e5b', '#6b3fa0', '#d7263d', '#ffd23f', '#1f4e9c'];
    let pregunta = 0;
    const dedos = new Map(); // pointerId → { x, y, color, el }
    let elegido = null; let espera;

    function pintar() {
      escenario.innerHTML = `<div class="dedo">
        <div class="dedo-preguntas" role="group">${PREGUNTAS.map((p, i) =>
          `<button type="button" data-p="${i}" aria-pressed="${i === pregunta}">${CE.L(p)}</button>`).join('')}</div>
        <div class="dedo-zona" data-zona>
          <p class="dedo-ayuda">${elegido !== null ? `🎯 ${CE.L(PREGUNTAS[pregunta])}` : CE.L({ es: '☝️ Todos a la vez: poned un dedo en la pantalla y no lo levantéis', de: '☝️ Alle gleichzeitig: einen Finger auf den Bildschirm legen und liegen lassen' })}</p>
        </div>
        <button class="boton contorno pequeno" type="button" data-lista>🎲 ${CE.L({ es: 'Sin pantalla táctil: elegir de la lista de jugadores', de: 'Ohne Touchscreen: aus der Spielerliste wählen' })}</button>
        <p class="dedo-lista" aria-live="polite"></p>
        ${CE.pieBeber()}
      </div>`;
      dedos.forEach((d) => escenario.querySelector('[data-zona]').appendChild(d.el));
    }

    const zona = () => escenario.querySelector('[data-zona]');
    function colocar(d) { d.el.style.left = `${d.x}px`; d.el.style.top = `${d.y}px`; }
    function reiniciarEspera() {
      clearTimeout(espera);
      if (elegido === null && dedos.size >= 2) espera = setTimeout(elegir, 2200);
    }
    function elegir() {
      const ids = [...dedos.keys()];
      elegido = CE.azar(ids);
      dedos.forEach((d, id) => d.el.classList.add(id === elegido ? 'ganador' : 'fuera'));
      zona().classList.add('decidido');
      zona().querySelector('.dedo-ayuda').textContent = `🎯 ${CE.L(PREGUNTAS[pregunta])}`;
      navigator.vibrate?.(200);
    }

    escenario.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('[data-zona]')) return;
      e.preventDefault();
      if (elegido !== null && dedos.size === 0) { elegido = null; pintar(); }
      if (elegido !== null) return;
      const r = zona().getBoundingClientRect();
      const el = document.createElement('span');
      el.className = 'dedo-circulo';
      el.style.setProperty('--c', COLORES[dedos.size % COLORES.length]);
      const d = { x: e.clientX - r.left, y: e.clientY - r.top, el };
      dedos.set(e.pointerId, d);
      zona().appendChild(el); colocar(d);
      try { zona().setPointerCapture(e.pointerId); } catch (err) { /* puntero simulado */ }
      reiniciarEspera();
    }, { signal: ac.signal });
    escenario.addEventListener('pointermove', (e) => {
      const d = dedos.get(e.pointerId);
      if (!d) return;
      const r = zona().getBoundingClientRect();
      d.x = e.clientX - r.left; d.y = e.clientY - r.top; colocar(d);
    }, { signal: ac.signal });
    const soltar = (e) => {
      const d = dedos.get(e.pointerId);
      if (!d) return;
      if (elegido === null) { d.el.remove(); }
      dedos.delete(e.pointerId);
      if (elegido !== null && dedos.size === 0) {
        // Todos han levantado el dedo: se puede volver a jugar tocando de nuevo
        setTimeout(() => { if (!dedos.size) { zona().querySelectorAll('.dedo-circulo').forEach((c) => c.remove()); } }, 1500);
      }
      reiniciarEspera();
    };
    escenario.addEventListener('pointerup', soltar, { signal: ac.signal });
    escenario.addEventListener('pointercancel', soltar, { signal: ac.signal });

    escenario.addEventListener('click', (e) => {
      const p = e.target.closest('[data-p]');
      if (p) { pregunta = Number(p.dataset.p); dedos.clear(); elegido = null; clearTimeout(espera); pintar(); return; }
      if (e.target.closest('[data-lista]')) {
        const lista = CE.jugadores.lista();
        const out = escenario.querySelector('.dedo-lista');
        out.innerHTML = lista.length >= 2
          ? `🎯 ${CE.L(PREGUNTAS[pregunta])} <b>${CE.esc(CE.azar(lista))}</b>`
          : CE.L({ es: 'Apunta antes a los jugadores en la pirinola o el cubilete.', de: 'Trag zuerst die Spieler bei Pirinola oder Cubilete ein.' });
      }
    }, { signal: ac.signal });

    pintar();
    return { idioma: () => { if (!dedos.size) pintar(); }, destruir: () => { ac.abort(); clearTimeout(espera); } };
  },
};
