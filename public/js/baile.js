// Pixel art: pareja bailando (él con sombrero, ella con vestido de volantes) y notas musicales.
// Se dibuja en un lienzo de 40×36 píxeles que el CSS amplía con "image-rendering: pixelated".
window.CE = window.CE || {};

CE.baile = (canvas) => {
  const W = 40; const H = 36;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const C = {
    H: '#f2a541', h: '#d42d3b', K: '#e0a878', k: '#c88d5e', D: '#22180f', Wt: '#f4ead9', B: '#1d2440',
    R: '#d42d3b', r: '#9e1b27', P: '#e93d8f', F: '#ffd23f', S: '#3a2a1d', N: '#a259ff', sombra: 'rgba(0,0,0,.35)',
  };
  const px = (c, x, y, w = 1, h = 1) => { ctx.fillStyle = C[c] || c; ctx.fillRect(x, y, w, h); };

  function nota(x, y, color) {
    px(color, x, y, 1, 4); px(color, x - 1, y + 3, 2, 2); px(color, x + 1, y, 1, 1); px(color, x + 2, y + 1, 1, 1);
  }

  function frame(f) {
    ctx.clearRect(0, 0, W, H);
    const b = f % 2;                // rebote
    const sw = [-2, 0, 2, 0][f];    // vuelo de la falda
    // sombras en el suelo
    px('sombra', 7, 34, 10, 1); px('sombra', 22, 34, 12, 1);

    // ---------- Él ----------
    const y0 = 3 + b;
    px('H', 9, y0, 6, 2); px('h', 9, y0 + 2, 6, 1);                 // copa y cinta del sombrero
    px('H', 5, y0 + 3, 14, 1); px('H', 5, y0 + 2); px('H', 18, y0 + 2); // ala
    px('K', 9, y0 + 4, 6, 5);                                          // cara
    px('D', 10, y0 + 5); px('D', 13, y0 + 5);                          // ojos
    px('D', 10, y0 + 7, 4, 1); px('D', 9, y0 + 8); px('D', 14, y0 + 8); // bigote
    px('k', 11, y0 + 9, 2, 1);                                         // cuello
    px('Wt', 8, y0 + 10, 8, 7); px('h', 8, y0 + 15, 8, 1);             // camisa y faja
    px('Wt', 16, y0 + 9, 5, 2); px('K', 21, y0 + 8, 1, 2);             // brazo que coge la mano de ella
    if (f % 2) { px('Wt', 6, y0 + 6, 2, 5); px('K', 6, y0 + 5, 2, 1); } // brazo libre arriba
    else { px('Wt', 6, y0 + 10, 2, 4); px('K', 7, y0 + 14); }           // mano en la cadera
    px('B', 9, y0 + 17, 3, 12);                                        // pierna izquierda
    if (f === 1 || f === 3) { px('B', 12, y0 + 17, 3, 8); px('B', 14, y0 + 25, 2, 2); px('S', 14, y0 + 27, 3, 1); } // pierna levantada
    else { px('B', 12, y0 + 17, 3, 12); px('S', 12, y0 + 29, 4, 1); }
    px('S', 8, y0 + 29, 4, 1);

    // ---------- Ella ----------
    const y1 = 6 + (1 - b);
    px('D', 25, y1, 6, 7); px('D', 30, y1 + 7, 2, 3);                   // pelo (largo por detrás)
    px('F', 29, y1, 2, 2); px('h', 29, y1);                            // flor
    px('K', 26, y1 + 2, 4, 5);                                         // cara
    px('D', 26, y1 + 3); px('D', 28, y1 + 3); px('R', 27, y1 + 5, 2, 1); // ojos y labios
    px('k', 27, y1 + 7, 2, 1);                                         // cuello
    px('R', 25, y1 + 8, 6, 5); px('r', 25, y1 + 12, 6, 1);            // cuerpo del vestido
    px('K', 22, y1 + 5, 3, 2); px('K', 24, y1 + 7, 1, 2);             // brazo hacia él
    if (f % 2) { px('K', 31, y1 + 3, 2, 6); } else { px('K', 31, y1 + 8, 2, 4); } // brazo libre
    for (let i = 0; i < 10; i++) {                                     // falda que se abre y se mueve
      const mitad = 3 + Math.floor(i * 0.65);
      const centro = 28 + Math.round(sw * (i / 9));
      px(i >= 8 ? 'P' : i === 5 ? 'r' : 'R', centro - mitad, y1 + 13 + i, mitad * 2, 1);
    }
    px('K', 26, y1 + 23, 1, 3); px('K', 29, y1 + 23, 1, 3);            // piernas
    px('S', 25, y1 + 26, 2, 1); px('S', 29, y1 + 26, 2, 1);            // zapatos

    // ---------- Notas musicales que suben ----------
    const t = f;
    nota(3, 12 - t * 2, C.N);
    nota(35, 6 + ((t + 2) % 4) * 2, C.F);
    if (f >= 2) nota(20, 2 + (f - 2), C.P);
  }

  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let f = 0; let visible = false;
  frame(0);
  if (reducido) return;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
  setInterval(() => { if (visible) { f = (f + 1) % 4; frame(f); } }, 240);
};
