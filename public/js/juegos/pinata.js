// La piñata del jefe: la piñata (con la cara del jefe) se balancea; tócala para sumar puntos.
// 30 segundos. Cada acierto seguido multiplica (combo); fallar lo reinicia. Cada 12 golpes se rompe.
CE.juegos.pinata = {
  iniciar(escenario) {
    const ac = new AbortController();
    const DURACION = 30;
    escenario.innerHTML = `<div class="arcade">
      <div class="marcador-arcade"><span>⏱️ <b data-t>${DURACION}</b></span><span>${CE.t('ahorcado.puntos')} <b data-p>0</b></span><span>🔥 x<b data-c>1</b></span></div>
      <div class="arcade-lienzo" style="position:relative"></div></div>`;
    const cont = escenario.querySelector('.arcade-lienzo');
    const lz = CE.lienzo(escenario, 1.2);
    cont.appendChild(lz.c);
    const { ctx, medida } = lz;
    const COLORES = ['#e93d8f', '#f2a541', '#2cc4d6', '#a259ff', '#2e9e5b', '#d42d3b', '#ffd23f'];
    let jefe = null; let raf = 0; let jugando = false;
    let puntos; let combo; let golpes; let fase; let velocidad; let amplitud; let inicio; let ultimo; let sacudida; let particulas; let textos; let color;

    CE.imagenJefe().then((j) => { jefe = j; dibujar(); });

    function reiniciar() {
      puntos = 0; combo = 1; golpes = 0; fase = 0; velocidad = 1.6; amplitud = 0.75; sacudida = 0;
      particulas = []; textos = []; color = 0;
    }
    const geometria = () => {
      const L = medida.h * 0.42;
      const ang = Math.sin(fase) * amplitud;
      const r = Math.min(medida.w, medida.h) * 0.17;
      return { x: medida.w / 2 + Math.sin(ang) * L, y: Math.cos(ang) * L + 10, r, ang };
    };

    function estrella(x, y, r, rot) {
      const puntas = 7;
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      for (let i = 0; i < puntas; i++) {
        const a = (i / puntas) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a - 0.22) * r * 0.75, Math.sin(a - 0.22) * r * 0.75);
        ctx.lineTo(Math.cos(a) * r * 1.75, Math.sin(a) * r * 1.75);
        ctx.lineTo(Math.cos(a + 0.22) * r * 0.75, Math.sin(a + 0.22) * r * 0.75);
        ctx.closePath();
        ctx.fillStyle = COLORES[(i + color) % COLORES.length]; ctx.fill();
        // flecos de papel en la punta
        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 1.75, Math.sin(a) * r * 1.75);
        ctx.lineTo(Math.cos(a) * r * 2.05, Math.sin(a) * r * 2.05); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = '#f8efe4'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = COLORES[color % COLORES.length]; ctx.stroke();
      ctx.restore();
    }

    function dibujar() {
      const { w, h } = medida;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#2a1240'); g.addColorStop(1, '#0d0a08');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const p = geometria();
      const dx = sacudida ? (Math.random() - 0.5) * sacudida : 0;
      ctx.strokeStyle = '#c9a46a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(p.x + dx, p.y - p.r); ctx.stroke();
      estrella(p.x + dx, p.y, p.r, p.ang * 0.6);
      CE.dibujarJefe(ctx, jefe, p.x + dx, p.y + p.r * 0.08, p.r * 1.45);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      particulas.forEach((q) => { ctx.font = `${q.s}px serif`; ctx.fillText(q.e, q.x, q.y); });
      textos.forEach((t) => {
        ctx.globalAlpha = Math.max(0, t.vida); ctx.font = `400 ${t.s}px "Bebas Neue", sans-serif`;
        ctx.fillStyle = t.c; ctx.fillText(t.txt, t.x, t.y); ctx.globalAlpha = 1;
      });
    }

    function marcador(resta) {
      escenario.querySelector('[data-t]').textContent = Math.ceil(resta);
      escenario.querySelector('[data-p]').textContent = puntos;
      escenario.querySelector('[data-c]').textContent = combo;
    }

    function bucle(t) {
      const dt = Math.min(0.05, (t - ultimo) / 1000); ultimo = t;
      const transcurrido = (t - inicio) / 1000;
      const resta = DURACION - transcurrido;
      velocidad = 1.6 + transcurrido * 0.07;
      fase += dt * velocidad;
      if (Math.random() < dt * 0.4) amplitud = 0.5 + Math.random() * 0.45;
      sacudida = Math.max(0, sacudida - dt * 60);
      particulas.forEach((q) => { q.vy += 900 * dt; q.x += q.vx * dt; q.y += q.vy * dt; });
      particulas = particulas.filter((q) => q.y < medida.h + 40);
      textos.forEach((x) => { x.y -= 40 * dt; x.vida -= dt * 1.4; });
      textos = textos.filter((x) => x.vida > 0);
      dibujar(); marcador(Math.max(0, resta));
      if (resta <= 0) { terminar(); return; }
      raf = requestAnimationFrame(bucle);
    }

    function lluviaCaramelos(x, y, n) {
      for (let i = 0; i < n; i++) {
        particulas.push({ e: CE.azar(['🍬', '🍭', '🍫', '⭐', '🌶️']), x, y, s: 18 + Math.random() * 14,
          vx: (Math.random() - 0.5) * 420, vy: -250 - Math.random() * 380 });
      }
    }

    function tocar(e) {
      if (!jugando) return;
      e.preventDefault();
      const r = lz.c.getBoundingClientRect();
      const x = e.clientX - r.left; const y = e.clientY - r.top;
      const p = geometria();
      if (Math.hypot(x - p.x, y - p.y) < p.r * 1.6) {
        const suma = 10 * combo;
        puntos += suma; golpes++; combo = Math.min(combo + 1, 10); sacudida = 14;
        textos.push({ txt: `+${suma}`, x, y: y - 20, s: 30, c: '#ffd23f', vida: 1 });
        lluviaCaramelos(p.x, p.y, 3);
        if (golpes % 12 === 0) {
          puntos += 100; color++; lluviaCaramelos(p.x, p.y, 26);
          textos.push({ txt: CE.L({ es: '¡SE ROMPIÓ! +100', de: 'KAPUTT! +100' }), x: medida.w / 2, y: medida.h * 0.75, s: 44, c: '#e93d8f', vida: 1.6 });
          navigator.vibrate?.(80);
        }
      } else {
        combo = 1;
        textos.push({ txt: CE.L({ es: '¡Fallaste!', de: 'Daneben!' }), x, y, s: 24, c: '#fff', vida: 0.8 });
      }
    }

    function empezar() {
      reiniciar(); jugando = true;
      inicio = performance.now(); ultimo = inicio;
      raf = requestAnimationFrame(bucle);
    }
    function terminar() {
      jugando = false; cancelAnimationFrame(raf);
      CE.finPartida(escenario, { juego: 'pinata', puntos, alOtra: empezar });
    }

    lz.c.addEventListener('pointerdown', tocar, { signal: ac.signal });
    reiniciar();
    dibujar();
    CE.pantallaInicio(cont, {
      icono: '🪅',
      texto: CE.L({ es: 'Toca la piñata del jefe todas las veces que puedas en 30 segundos. ¡Si aciertas seguido, multiplicas!', de: 'Tippe 30 Sekunden lang so oft wie möglich auf die Chef-Piñata. Treffer in Serie multiplizieren die Punkte!' }),
      alEmpezar: empezar,
    });
    return { destruir() { ac.abort(); cancelAnimationFrame(raf); lz.quitar(); } };
  },
};
