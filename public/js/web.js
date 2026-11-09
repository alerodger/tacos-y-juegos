// Portada: pinta destacados, carta, galería y datos de contacto.
(async () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const esc = CE.esc;

  CE.montarIdiomas();
  CE.papelPicado();

  // Menú móvil
  const navBoton = $('.nav-boton');
  const nav = $('#nav');
  navBoton.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    navBoton.setAttribute('aria-expanded', String(abierto));
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) nav.classList.remove('abierto'); });

  const datos = await CE.cargarDatos();
  const a = datos.ajustes;
  const cats = datos.categorias;
  let catActiva = cats[0]?.id;
  const grupoDe = (id) => cats.find((c) => c.id === id)?.grupo || 'comida';

  // Enlaces del tipo #carta-cocteles abren la carta en esa categoría (los usan los juegos)
  const desdeHash = location.hash.match(/^#carta-(.+)$/);
  if (desdeHash && cats.some((c) => c.id === desdeHash[1])) {
    catActiva = desdeHash[1];
    requestAnimationFrame(() => document.getElementById('carta').scrollIntoView());
  }

  // Datos fijos del restaurante
  const [n1, ...nResto] = a.nombre.split(' ');
  $('[data-nombre-1]').textContent = n1;
  $('[data-nombre-2]').textContent = nResto.join(' ');
  $$('.logo img').forEach((img) => { img.alt = a.nombre; });
  $$('[data-reserva]').forEach((el) => { el.href = a.reserva_url || `tel:${a.telefono}`; });
  $$('[data-maps]').forEach((el) => { el.href = a.maps_url; });
  $$('[data-instagram]').forEach((el) => { el.href = `https://www.instagram.com/${a.instagram}/`; });
  $$('[data-instagram-usuario]').forEach((el) => { el.textContent = `@${a.instagram}`; });
  $('[data-direccion]').innerHTML = `${esc(a.direccion)}<br>${esc(a.cp_ciudad)}`;
  const tel = $('[data-telefono]');
  tel.textContent = `📞 ${a.telefono}`;
  tel.href = `tel:${a.telefono.replace(/\s/g, '')}`;
  $('[data-aviso-demo]').hidden = !datos.demo;
  $('[data-cifra-tequilas]').textContent = `${datos.platos.filter((p) => p.cat === 'shots' && /tequila|mezcal/i.test(p.sub_es || '')).length}`;
  $('[data-cifra-cocteles]').textContent = `${datos.platos.filter((p) => ['cocteles', 'margaritas', 'clasicos', 'spritz'].includes(p.cat)).length}`;

  const precioPlato = (p) => (p.variantes?.length
    ? `${CE.t('carta.desde')} ${CE.precio(Math.min(...p.variantes.map((v) => v.precio)))}`
    : CE.precio(p.precio));

  function pintarFijos() {
    const eslogan = CE.tx(a, 'eslogan') || '';
    $('[data-eslogan]').innerHTML = esc(eslogan).replace('&amp;', '<b>&amp;</b>');
    // Notas en otras webs (pequeñas, debajo del aviso de abierto/cerrado)
    const MARCAS = { thefork: ['#00665c', '🍴'], google: ['#4285f4', 'G'], tripadvisor: ['#34e0a1', '🦉'], lieferando: ['#ff8000', '🛵'] };
    const valoraciones = (a.valoraciones?.length ? a.valoraciones
      : a.valoracion ? [{ fuente: a.valoracion_fuente, nota: a.valoracion, opiniones: a.valoracion_opiniones, url: a.reserva_url }] : [])
      .filter((v) => v.fuente && (v.nota || v.opiniones));
    $('[data-pruebas]').innerHTML = valoraciones.map((v) => {
      const [color, ico] = MARCAS[String(v.fuente).toLowerCase()] || ['#888', '★'];
      return `<a class="prueba" href="${esc(v.url || '#')}" target="_blank" rel="noopener" style="--m:${color}">
        <i aria-hidden="true">${ico}</i><span>${esc(v.fuente)}</span>
        ${v.nota ? `<b>${esc(v.nota)}${v.escala ? `<small>/${esc(v.escala)}</small>` : ''}</b>` : '<b>★★★★★</b>'}
        ${v.opiniones ? `<em>${esc(v.opiniones)} ${CE.t('valoracion.opiniones')}</em>` : ''}</a>`;
    }).join('');
  }

  // Hall of Fame: mini feed tipo Instagram con reseñas reales y fotos del local
  function pintarHall() {
    const ops = datos.opiniones || [];
    $('#hall').hidden = !ops.length;
    const nombreIdioma = { es: CE.L({ es: 'español', de: 'Spanisch' }), de: CE.L({ es: 'alemán', de: 'Deutsch' }), en: CE.L({ es: 'inglés', de: 'Englisch' }) };
    const fotos = datos.fotos.map((f) => f.url);
    $('[data-hall]').innerHTML = ops.map((o, i) => {
      const foto = o.foto || fotos[i % Math.max(1, fotos.length)];
      // En el idioma de la web; si la reseña se escribió en otro, se enseña también el original
      const original = o.idioma === CE.idioma ? null : (o.texto_original || o[`texto_${o.idioma}`]);
      const texto = o[`texto_${CE.idioma}`] || o.texto_original;
      const fecha = o.fecha ? new Date(o.fecha).toLocaleDateString(CE.idioma === 'de' ? 'de-DE' : 'es-ES', { month: 'short', year: 'numeric' }) : '';
      const iniciales = o.autor.split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase();
      return `<article class="post aparece visible">
        <header><span class="post-avatar" style="--h:${(i * 67) % 360}">${esc(iniciales)}</span>
          <span><b>${esc(o.autor)}</b><small>${esc(o.fuente)}${fecha ? ` · ${esc(fecha)}` : ''}</small></span><span class="post-fuente">${esc(o.fuente)}</span></header>
        ${foto ? `<div class="post-foto"><img src="${esc(foto)}" alt="" loading="lazy"></div>` : ''}
        <div class="post-cuerpo">
          <p class="post-iconos" aria-hidden="true">♥ 💬 ➤</p>
          <blockquote>“${esc(texto)}”</blockquote>
          ${original && original !== texto ? `<p class="post-original">${CE.L({ es: 'Traducido del', de: 'Übersetzt aus dem' })} ${nombreIdioma[o.idioma] || o.idioma} · <span lang="${esc(o.idioma)}">“${esc(original)}”</span></p>` : ''}
        </div>
      </article>`;
    }).join('');
    $('[data-hall-nota]').innerHTML = `${CE.L({ es: 'Reseñas reales publicadas en Google, elegidas por el restaurante.', de: 'Echte, auf Google veröffentlichte Bewertungen, ausgewählt vom Restaurant.' })}
      <a href="${esc(a.maps_url)}" target="_blank" rel="noopener">${CE.L({ es: 'Ver todas', de: 'Alle ansehen' })} →</a>`;
  }

  function pintarDestacados() {
    const colores = ['#d42d3b', '#a259ff', '#f2a541', '#2cc4d6', '#e93d8f'];
    $('[data-destacados]').innerHTML = datos.platos.filter((p) => p.destacado).map((p, i) => {
      const cat = cats.find((c) => c.id === p.cat);
      return `<a class="destacado-tarjeta aparece visible" href="#carta" data-ir-carta="${esc(p.cat)}" style="--c:${colores[i % colores.length]}">
        <div class="imagen">${p.foto ? `<img src="${esc(p.foto)}" alt="" loading="lazy">` : (cat?.icono || '🌮')}</div>
        <div class="cuerpo"><h3>${esc(CE.tx(p, 'nombre'))}</h3><p>${esc(CE.tx(p, 'desc'))}</p><span class="precio">${precioPlato(p)}</span></div>
      </a>`;
    }).join('');
  }

  function pintarCarta() {
    const grupo = grupoDe(catActiva);
    $$('[data-grupo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.grupo === grupo)));
    $('[data-pestanas]').innerHTML = cats.filter((c) => c.grupo === grupo).map((c) =>
      `<button role="tab" type="button" data-cat="${esc(c.id)}" aria-selected="${c.id === catActiva}">${c.icono || ''} ${esc(CE.tx(c, 'nombre'))}</button>`).join('');

    const cat = cats.find((c) => c.id === catActiva);
    const nota = $('[data-nota-cat]');
    nota.hidden = !CE.tx(cat, 'nota');
    nota.textContent = CE.tx(cat, 'nota');

    const lista = $('[data-carta]');
    lista.classList.toggle('compacta', !!cat?.lista);
    let subActual = null;
    lista.innerHTML = datos.platos.filter((p) => p.cat === catActiva).map((p) => {
      const sub = CE.tx(p, 'sub');
      const cabecera = sub && sub !== subActual ? `<h3 class="carta-sub">${esc(sub)}</h3>` : '';
      subActual = sub || subActual;
      const opciones = CE.tx(p, 'opciones');
      if (cat?.lista) {
        const extra = [CE.tx(p, 'desc'), opciones].filter(Boolean).join(' · ');
        return `${cabecera}<div class="fila"><b>${esc(CE.tx(p, 'nombre'))}</b><span class="precio">${p.variantes?.length
          ? p.variantes.map((v) => `${esc(CE.L(v))} ${CE.precio(v.precio)}`).join(' · ') : CE.precio(p.precio)}</span>${extra ? `<small>${esc(extra)}</small>` : ''}</div>`;
      }
      const etiquetas = [
        p.picante ? `<span class="etiqueta picante">${'🌶️'.repeat(p.picante)} ${CE.t('carta.picante')}</span>` : '',
        p.vegano ? `<span class="etiqueta veg">🌱 ${CE.t('carta.vegano')}</span>`
          : p.veg ? `<span class="etiqueta veg">🌿 ${CE.t('carta.veg')}</span>` : '',
        p.destacado ? `<span class="etiqueta">⭐ ${CE.t('carta.favorito')}</span>` : '',
      ].join('');
      const foto = p.foto
        ? `<button type="button" class="plato-foto" data-ampliar="${datos.platos.indexOf(p)}" aria-label="${esc(CE.L({ es: 'Ampliar foto', de: 'Foto vergrößern' }))}: ${esc(CE.tx(p, 'nombre'))}">
            <img src="${esc(p.foto)}" alt="" loading="lazy">${p.foto_ia ? `<span class="foto-ia">${CE.t('carta.fotoIa')}</span>` : ''}<span class="lupa" aria-hidden="true">⤢</span></button>`
        : '';
      return `${cabecera}<article class="plato${p.destacado ? ' destacado' : ''}">
        ${foto}
        <div class="plato-cuerpo">
          <h3>${esc(CE.tx(p, 'nombre'))}</h3>
          <span class="precio">${precioPlato(p)}</span>
          ${CE.tx(p, 'desc') ? `<p>${esc(CE.tx(p, 'desc'))}</p>` : ''}
          ${opciones ? `<p class="opciones">${esc(opciones)}</p>` : ''}
          ${p.variantes?.length ? `<ul class="variantes">${p.variantes.map((v) => `<li><span>${esc(CE.L(v))}</span><span>${CE.precio(v.precio)}</span></li>`).join('')}</ul>` : ''}
          ${etiquetas ? `<div class="etiquetas">${etiquetas}</div>` : ''}
        </div>
      </article>`;
    }).join('');
  }

  function pintarGaleria() {
    $('[data-galeria]').innerHTML = datos.fotos.map((f) => `
      <figure class="foto${f.ancho === 2 ? ' ancha' : ''}">
        <img src="${esc(f.url)}" alt="${esc(CE.tx(f, 'texto'))}" loading="lazy">
        <figcaption>${esc(CE.tx(f, 'texto'))}</figcaption>
      </figure>`).join('');
  }

  function pintarHorario() {
    $('[data-horario]').innerHTML = CE.horario.filas(a.horario).map((f) =>
      `<tr class="${f.cerrado ? 'cerrado' : ''}"><td>${esc(f.dias)}</td><td>${esc(f.horas)}</td></tr>`).join('');
    const estado = CE.horario.texto(a.horario);
    $$('[data-apertura]').forEach((el) => { el.hidden = !estado; el.textContent = estado; });
  }
  setInterval(pintarHorario, 60000);

  // Visor de fotos de la carta (se abre al tocar una foto)
  const visor = document.createElement('dialog');
  visor.className = 'visor';
  document.body.appendChild(visor);
  visor.addEventListener('click', (e) => { if (e.target === visor || e.target.closest('[data-cerrar]')) visor.close(); });
  $('[data-carta]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ampliar]');
    if (!b) return;
    const p = datos.platos[Number(b.dataset.ampliar)];
    visor.innerHTML = `<figure><img src="${esc(p.foto)}" alt="${esc(CE.tx(p, 'nombre'))}">
      ${p.foto_ia ? `<span class="foto-ia">${CE.t('carta.fotoIa')}</span>` : ''}
      <figcaption><b>${esc(CE.tx(p, 'nombre'))}</b><span class="precio">${precioPlato(p)}</span>${CE.tx(p, 'desc') ? `<p>${esc(CE.tx(p, 'desc'))}</p>` : ''}</figcaption></figure>
      <button type="button" class="visor-cerrar" data-cerrar aria-label="${esc(CE.L({ es: 'Cerrar', de: 'Schließen' }))}">✕</button>`;
    visor.showModal();
  });

  $('[data-pestanas]').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cat]');
    if (b) { catActiva = b.dataset.cat; pintarCarta(); }
  });
  $('[data-grupos]').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-grupo]');
    if (b) { catActiva = cats.find((c) => c.grupo === b.dataset.grupo)?.id; pintarCarta(); }
  });
  // Enlaces a una categoría concreta de la carta (destacados, tequila bar)
  document.addEventListener('click', (e) => {
    const l = e.target.closest('[data-ir-carta]');
    if (l && cats.some((c) => c.id === l.dataset.irCarta)) { catActiva = l.dataset.irCarta; pintarCarta(); }
  });

  function pintarTodo() { pintarFijos(); pintarDestacados(); pintarCarta(); pintarGaleria(); pintarHall(); pintarHorario(); }

  // Top 3 en la tele, pareja bailando y botones fijos
  CE.ajustes = a;
  CE.tele($('[data-tele]'), { enlace: 'juegos/?ranking' });
  CE.baile($('[data-baile]'));
  CE.botonesFijos({ carta: '#carta', juegos: 'juegos/', instagram: a.instagram });
  document.addEventListener('idioma', pintarTodo);
  CE.aplicarIdioma(); // aplica textos y dispara pintarTodo

  // Aparición al hacer scroll
  const io = new IntersectionObserver((entradas) => entradas.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  $$('.aparece').forEach((el) => io.observe(el));
})();
