// Tele antigua con el top 3 del ranking: cambia de canal (hoy / semana / mes) con estática
// y de vez en cuando "pierde la señal". Uso: CE.tele(contenedor, { enlace: 'juegos/?ranking' })
window.CE = window.CE || {};

CE.tele = (cont, { enlace = '?ranking' } = {}) => {
  const CANALES = ['semana', 'dia', 'mes'];
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let canal = 0; let datos = {}; let raf = 0; let ruido = 0.07; let visible = true;
  const timers = [];

  cont.innerHTML = `<a class="tele" href="${enlace}" aria-label="Top 3">
    <span class="tele-antena" aria-hidden="true"><i></i><i></i></span>
    <span class="tele-cuerpo">
      <span class="tele-pantalla">
        <span class="tele-contenido" data-contenido></span>
        <canvas class="tele-ruido" width="96" height="72" aria-hidden="true"></canvas>
        <span class="tele-lineas" aria-hidden="true"></span>
        <span class="tele-canal" data-canal></span>
      </span>
      <span class="tele-mandos" aria-hidden="true"><i class="rueda"></i><i class="rueda"></i><i class="rejilla"></i></span>
    </span>
    <span class="tele-patas" aria-hidden="true"><i></i><i></i></span>
  </a>`;
  const tele = cont.querySelector('.tele');
  const lienzo = cont.querySelector('.tele-ruido');
  const ctx = lienzo.getContext('2d');
  const img = ctx.createImageData(lienzo.width, lienzo.height);

  function dibujarRuido() {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    lienzo.style.opacity = ruido;
  }
  let ultimo = 0;
  function bucle(t) {
    if (visible && t - ultimo > 70) { dibujarRuido(); ultimo = t; }
    raf = requestAnimationFrame(bucle);
  }

  async function cargar(periodo) {
    const c = datos[periodo];
    if (c && Date.now() - c.t < 60000) return c.filas;
    try {
      const filas = await CE.ranking.top(periodo, 3);
      datos[periodo] = { filas, t: Date.now() };
      return filas;
    } catch (e) { return null; }
  }

  async function pintar() {
    const periodo = CANALES[canal];
    cont.querySelector('[data-canal]').textContent = `CH ${canal + 1}`;
    const filas = await cargar(periodo);
    const medallas = ['🥇', '🥈', '🥉'];
    cont.querySelector('[data-contenido]').innerHTML = `
      <span class="tele-titulo">TOP 3 · ${CE.t(`rk.${periodo}`)}</span>
      ${filas === null ? `<span class="tele-vacio">${CE.L({ es: 'SIN SEÑAL', de: 'KEIN SIGNAL' })}</span>`
        : filas.length ? `<ol class="tele-lista">${filas.map((f, i) => `<li><span>${medallas[i]}</span><b>@${CE.esc(f.instagram)}</b><em>${f.puntos}</em></li>`).join('')}</ol>`
          : `<span class="tele-vacio">${CE.t('rk.vacio')}</span>`}
      ${CE.ranking.demo ? '<span class="tele-demo">DEMO</span>' : ''}`;
  }

  // Cambio de canal: fogonazo de estática + salto
  function cambiar(dir = 1) {
    canal = (canal + dir + CANALES.length) % CANALES.length;
    tele.classList.add('estatica'); ruido = 0.95;
    timers.push(setTimeout(() => { pintar(); }, 260));
    timers.push(setTimeout(() => { tele.classList.remove('estatica'); ruido = 0.07; }, 520));
  }
  // Pérdida de señal de vez en cuando
  function fallo() {
    tele.classList.add('fallo'); ruido = 0.45;
    timers.push(setTimeout(() => { tele.classList.remove('fallo'); ruido = 0.07; }, 180 + Math.random() * 260));
    timers.push(setTimeout(fallo, 3500 + Math.random() * 6000));
  }

  const intervalo = setInterval(() => { if (visible) cambiar(1); }, 7000);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.1 });
  io.observe(tele);

  pintar();
  if (!reducido) { raf = requestAnimationFrame(bucle); timers.push(setTimeout(fallo, 2500)); } else { dibujarRuido(); }
  document.addEventListener('idioma', pintar);
  return {
    destruir() { cancelAnimationFrame(raf); clearInterval(intervalo); timers.forEach(clearTimeout); io.disconnect(); document.removeEventListener('idioma', pintar); },
  };
};
