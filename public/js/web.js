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
    const v = $('[data-valoracion]');
    v.hidden = !a.valoracion;
    if (a.valoracion) {
      v.href = a.reserva_url || '#';
      v.innerHTML = `<b>${esc(a.valoracion)}</b> ★ ${esc(a.valoracion_fuente || '')} · ${esc(a.valoracion_opiniones || '')} ${CE.t('valoracion.opiniones')}`;
    }
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
      return `${cabecera}<article class="plato${p.foto ? ' con-foto' : ''}${p.destacado ? ' destacado' : ''}">
        ${p.foto ? `<img src="${esc(p.foto)}" alt="" loading="lazy">` : ''}
        <h3>${esc(CE.tx(p, 'nombre'))}</h3>
        <span class="precio">${precioPlato(p)}</span>
        ${CE.tx(p, 'desc') ? `<p>${esc(CE.tx(p, 'desc'))}</p>` : ''}
        ${opciones ? `<p class="opciones">${esc(opciones)}</p>` : ''}
        ${p.variantes?.length ? `<ul class="variantes">${p.variantes.map((v) => `<li><span>${esc(CE.L(v))}</span><span>${CE.precio(v.precio)}</span></li>`).join('')}</ul>` : ''}
        ${etiquetas ? `<div class="etiquetas">${etiquetas}</div>` : ''}
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
    $('[data-horario]').innerHTML = (a.horario || []).map((h) =>
      `<tr><td>${esc(CE.tx(h, 'dias'))}</td><td>${esc(CE.tx(h, 'horas') || h.horas || '')}</td></tr>`).join('');
  }

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

  function pintarTodo() { pintarFijos(); pintarDestacados(); pintarCarta(); pintarGaleria(); pintarHorario(); }
  document.addEventListener('idioma', pintarTodo);
  CE.aplicarIdioma(); // aplica textos y dispara pintarTodo

  // Aparición al hacer scroll
  const io = new IntersectionObserver((entradas) => entradas.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  $$('.aparece').forEach((el) => io.observe(el));
})();
