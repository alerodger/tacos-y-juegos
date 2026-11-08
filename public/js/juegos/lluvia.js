// Lluvia de tacos: mueve al jefe para recoger la comida que cae y esquiva los chiles.
// Tres vidas; cada vez cae más rápido. La margarita dorada vale mucho.
CE.juegos.lluvia = {
  iniciar(escenario) {
    const ac = new AbortController();
    const VIDAS = 3;
    const TIPOS = [
      { e: '🌮', p: 10, peso: 50 }, { e: '🥑', p: 15, peso: 18 }, { e: '🌯', p: 20, peso: 12 },
      { e: '🌽', p: 10, peso: 14 }, { e: '🍹', p: 50, peso: 3 }, { e: '🌶️', p: 0, peso: 22, malo: true },
    ];
    const totalPeso = TIPOS.reduce((s, t) => s + t.peso, 0);
    escenario.innerHTML = `<div class="arcade">
      <div class="marcador-arcade"><span data-vidas></span><span>${CE.t('ahorcado.puntos')} <b data-p>0</b></span></div>
      <div class="arcade-lienzo" style="position:relative"></div></div>`;
    const cont = escenario.querySelector('.arcade-lienzo');
    const lz = CE.lienzo(escenario, 1.35);
    cont.appendChild(lz.c);
    const { ctx, medida } = lz;
    let jefe = null; let raf = 0; let jugando = false;
    let puntos; let vidas; let objetos; let textos; let x; let objetivoX; let inicio; let ultimo; let proximo; let golpe; const teclas = {};

    CE.imagenJefe().then((j) => { jefe = j; dibujar(); });

    const tam = () => Math.min(medida.w, medida.h) * 0.2;
    function reiniciar() { puntos = 0; vidas = VIDAS; objetos = []; textos = []; x = medida.w / 2; objetivoX = x; proximo = 0; golpe = 0; }
    function azarTipo(dificultad) {
      // con el tiempo salen más chiles
      let r = Math.random() * (totalPeso + dificultad * 10);
      if (r >= totalPeso) return TIPOS[5];
      for (const t of TIPOS) { if ((r -= t.peso) < 0) return t; }
      return TIPOS[0];
    }

    function dibujar() {
      const { w, h } = medida;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#13304a'); g.addColorStop(0.7, '#2a1240'); g.addColorStop(1, '#0d0a08');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      // suelo de azulejo
      ctx.fillStyle = '#c4632f'; ctx.fillRect(0, h - 14, w, 14);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      objetos.forEach((o) => { ctx.font = `${o.s}px serif`; ctx.fillText(o.t.e, o.x, o.y); });
      const d = tam();
      if (golpe > 0) ctx.globalAlpha = 0.5 + 0.5 * Math.sin(golpe * 40);
      CE.dibujarJefe(ctx, jefe, x, h - d * 0.55 - 14, d);
      ctx.globalAlpha = 1;
      textos.forEach((t) => {
        ctx.globalAlpha = Math.max(0, t.vida); ctx.font = `400 ${t.s}px "Bebas Neue", sans-serif`;
        ctx.fillStyle = t.c; ctx.fillText(t.txt, t.x, t.y); ctx.globalAlpha = 1;
      });
    }
    function marcador() {
      escenario.querySelector('[data-vidas]').textContent = '❤️'.repeat(vidas) + '🖤'.repeat(VIDAS - vidas);
      escenario.querySelector('[data-p]').textContent = puntos;
    }

    function bucle(t) {
      const dt = Math.min(0.05, (t - ultimo) / 1000); ultimo = t;
      const seg = (t - inicio) / 1000;
      const dif = Math.min(seg / 60, 2.5);
      const { w, h } = medida;
      if (teclas.ArrowLeft) objetivoX -= 520 * dt;
      if (teclas.ArrowRight) objetivoX += 520 * dt;
      const margen = tam() * 0.62;
      objetivoX = Math.max(margen, Math.min(w - margen, objetivoX));
      x += (objetivoX - x) * Math.min(1, dt * 14);
      proximo -= dt;
      if (proximo <= 0) {
        const s = Math.min(w, h) * (0.085 + Math.random() * 0.03);
        objetos.push({ t: azarTipo(dif), x: s + Math.random() * (w - s * 2), y: -s, s, vy: h * (0.28 + dif * 0.22 + Math.random() * 0.12) });
        proximo = Math.max(0.28, 0.9 - dif * 0.25) * (0.6 + Math.random() * 0.6);
      }
      const d = tam(); const jy = h - d * 0.55 - 14;
      objetos.forEach((o) => {
        o.y += o.vy * dt;
        if (!o.fuera && Math.abs(o.x - x) < d * 0.6 && Math.abs(o.y - jy) < d * 0.55) {
          o.fuera = true;
          if (o.t.malo) {
            if (golpe <= 0) { vidas--; golpe = 1; navigator.vibrate?.(120); textos.push({ txt: '¡Ay!', x: o.x, y: o.y - 20, s: 34, c: '#ff5a67', vida: 1 }); }
          } else {
            puntos += o.t.p;
            textos.push({ txt: `+${o.t.p}`, x: o.x, y: o.y - 20, s: o.t.p >= 50 ? 40 : 28, c: o.t.p >= 50 ? '#ffd23f' : '#fff', vida: 1 });
          }
        }
      });
      objetos = objetos.filter((o) => !o.fuera && o.y < h + 40);
      golpe = Math.max(0, golpe - dt);
      textos.forEach((x2) => { x2.y -= 40 * dt; x2.vida -= dt * 1.5; });
      textos = textos.filter((x2) => x2.vida > 0);
      dibujar(); marcador();
      if (vidas <= 0) { terminar(); return; }
      raf = requestAnimationFrame(bucle);
    }

    const mover = (e) => {
      if (!jugando) return;
      const r = lz.c.getBoundingClientRect();
      objetivoX = e.clientX - r.left;
    };
    lz.c.addEventListener('pointerdown', (e) => { e.preventDefault(); mover(e); }, { signal: ac.signal });
    lz.c.addEventListener('pointermove', mover, { signal: ac.signal });
    document.addEventListener('keydown', (e) => { if (e.key.startsWith('Arrow')) { teclas[e.key] = true; if (jugando) e.preventDefault(); } }, { signal: ac.signal });
    document.addEventListener('keyup', (e) => { teclas[e.key] = false; }, { signal: ac.signal });

    function empezar() {
      reiniciar(); jugando = true; marcador();
      inicio = performance.now(); ultimo = inicio;
      raf = requestAnimationFrame(bucle);
    }
    function terminar() {
      jugando = false; cancelAnimationFrame(raf);
      CE.finPartida(escenario, { juego: 'lluvia', puntos, alOtra: empezar });
    }

    reiniciar(); marcador(); dibujar();
    CE.pantallaInicio(cont, {
      icono: '🌮🥑🍹 · 🌶️❌',
      texto: CE.L({ es: 'Mueve al jefe con el dedo (o con las flechas) para recoger tacos, aguacates y burritos. La margarita vale 50. ¡Cuidado con los chiles: tienes 3 vidas!',
        de: 'Bewege den Chef mit dem Finger (oder den Pfeiltasten) und fang Tacos, Avocados und Burritos. Die Margarita bringt 50. Vorsicht vor Chilis – du hast 3 Leben!' }),
      alEmpezar: empezar,
    });
    return { destruir() { ac.abort(); cancelAnimationFrame(raf); lz.quitar(); } };
  },
};
