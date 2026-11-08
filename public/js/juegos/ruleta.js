// La ruleta del jefe: rueda con la cara del jefe en el centro.
CE.juegos.ruleta = {
  iniciar(escenario) {
    const ac = new AbortController();
    const SEGMENTOS = [
      { ico: '🥃', c: '#d7263d', es: '¡Chupito para ti!', de: 'Ein Shot für dich!' },
      { ico: '3️⃣', c: '#0e9aa7', es: 'Reparte 3 tragos', de: 'Verteile 3 Schlucke' },
      { ico: '🍻', c: '#f6a21e', es: '¡Salud! Todos beben', de: '¡Salud! Alle trinken' },
      { ico: '😇', c: '#2e9e5b', es: 'Te salvas esta vez', de: 'Diesmal kommst du davon' },
      { ico: '🤝', c: '#6b3fa0', es: 'Elige compañero: bebe cada vez que tú bebas hasta tu próximo turno', de: 'Wähl einen Trinkpartner: Er trinkt immer mit dir bis zu deiner nächsten Runde' },
      { ico: '🔥', c: '#e8407c', es: 'Reto: la persona de tu izquierda te pone uno', de: 'Pflicht: Die Person links von dir denkt sich eine aus' },
      { ico: '🛎️', c: '#0e5e6f', es: 'Tú pides la próxima ronda', de: 'Du bestellst die nächste Runde' },
      { ico: '🇲🇽', c: '#d7263d', es: 'Hasta tu próximo turno solo hablas español', de: 'Bis zu deiner nächsten Runde nur Spanisch sprechen' },
      { ico: '👉', c: '#0e9aa7', es: 'Bebe la persona de tu derecha', de: 'Die Person rechts von dir trinkt' },
      { ico: '🔁', c: '#f6a21e', es: '¡Gira otra vez!', de: 'Nochmal drehen!' },
    ];
    // Premio opcional que el dueño configura en el panel (p. ej. "10 % en la siguiente ronda")
    const a = CE.ajustes || {};
    if (a.promo_ruleta_es || a.promo_ruleta_de) {
      SEGMENTOS.splice(5, 0, { ico: '🎁', c: '#ffd23f', es: a.promo_ruleta_es, de: a.promo_ruleta_de, promo: true });
    }
    const N = SEGMENTOS.length; const ANG = 360 / N; const R = 140;
    let giro = 0; let girando = false; let resultado = null;

    const punto = (ang, r) => [Math.sin(ang * Math.PI / 180) * r, -Math.cos(ang * Math.PI / 180) * r];
    const rueda = () => SEGMENTOS.map((s, i) => {
      const [x1, y1] = punto(i * ANG, R); const [x2, y2] = punto((i + 1) * ANG, R);
      const [tx, ty] = punto((i + .5) * ANG, R * .72);
      return `<path d="M0 0L${x1} ${y1}A${R} ${R} 0 0 1 ${x2} ${y2}Z" fill="${s.c}" stroke="#fff6e8" stroke-width="3"/>
        <text x="${tx}" y="${ty}" transform="rotate(${(i + .5) * ANG} ${tx} ${ty})" text-anchor="middle" dominant-baseline="central" font-size="26">${s.ico}</text>`;
    }).join('');

    function pintar() {
      escenario.innerHTML = `<div class="ruleta">
        <p class="cartas-reglas">${CE.L({ es: 'Por turnos, gira la ruleta del jefe y cumple lo que salga.', de: 'Reihum am Glücksrad vom Chef drehen und machen, was rauskommt.' })}</p>
        <div class="rul-caja">
          <svg class="rul-puntero" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 38L4 6h32Z" fill="#22180f"/><path d="M20 30L10 10h20Z" fill="#ffd23f"/></svg>
          <svg class="rul-rueda" viewBox="-150 -150 300 300" style="transform:rotate(${giro}deg)" aria-hidden="true">
            <circle r="148" fill="#22180f"/>${rueda()}
          </svg>
          <svg class="rul-centro" viewBox="-50 -50 100 100" aria-hidden="true">
            <circle r="46" fill="#fff6e8" stroke="#22180f" stroke-width="4"/>
            ${CE.jefeEnSvg(0, 6, 66, 'rul')}
          </svg>
        </div>
        <div class="rul-resultado ${resultado?.promo ? 'promo' : ''}" aria-live="polite">${resultado && !girando ? `<span>${resultado.ico}</span> ${CE.esc(CE.L(resultado))}${resultado.promo ? `<small>${CE.L({ es: 'Enseña esta pantalla en la barra', de: 'Zeig diesen Bildschirm an der Bar' })}</small>` : ''}` : ''}</div>
        <button class="boton amarillo grande" type="button" data-girar ${girando ? 'disabled' : ''}>🎡 ${CE.L({ es: '¡Gira la ruleta!', de: 'Dreh das Rad!' })}</button>
        ${CE.pieBeber()}
      </div>`;
    }

    function girar() {
      if (girando) return;
      girando = true; resultado = null;
      const anterior = giro;
      giro += 360 * 5 + Math.random() * 360;
      pintar();
      const rueda = escenario.querySelector('.rul-rueda');
      // Fuerza el reflujo para que la transición arranque desde la posición anterior
      rueda.style.transition = 'none';
      rueda.style.transform = `rotate(${anterior}deg)`;
      rueda.getBoundingClientRect();
      rueda.style.transition = '';
      rueda.style.transform = `rotate(${giro}deg)`;
      setTimeout(() => {
        const angulo = (360 - (giro % 360)) % 360;
        resultado = SEGMENTOS[Math.floor(angulo / ANG) % N];
        girando = false;
        pintar();
      }, 4300);
    }

    escenario.addEventListener('click', (e) => { if (e.target.closest('[data-girar]')) girar(); }, { signal: ac.signal });
    pintar();
    return { idioma: () => { if (!girando) pintar(); }, destruir: () => ac.abort() };
  },
};
