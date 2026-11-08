// Portada: pinta carta, galería y datos de contacto.
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
  let catActiva = datos.categorias[0]?.id;

  // Nombre: la primera palabra en blanco, el resto destacado
  const [n1, ...nResto] = a.nombre.split(' ');
  const nombreHtml = `${esc(n1)} <span>${esc(nResto.join(' '))}</span>`;
  $$('[data-nombre-logo], [data-nombre-titulo]').forEach((el) => { el.innerHTML = nombreHtml; });

  $$('[data-reserva]').forEach((el) => { el.href = a.reserva_url || `tel:${a.telefono}`; });
  $$('[data-maps]').forEach((el) => { el.href = a.maps_url; });
  $$('[data-instagram]').forEach((el) => { el.href = `https://www.instagram.com/${a.instagram}/`; });
  $$('[data-instagram-usuario]').forEach((el) => { el.textContent = `@${a.instagram}`; });
  $('[data-direccion]').innerHTML = `${esc(a.direccion)}<br>${esc(a.cp_ciudad)}`;
  const tel = $('[data-telefono]');
  tel.textContent = `📞 ${a.telefono}`;
  tel.href = `tel:${a.telefono.replace(/\s/g, '')}`;
  $('[data-aviso-demo]').hidden = !datos.demo;

  function pintarCarta() {
    $('[data-pestanas]').innerHTML = datos.categorias.map((c) =>
      `<button role="tab" type="button" data-cat="${esc(c.id)}" aria-selected="${c.id === catActiva}">${c.icono || ''} ${esc(CE.tx(c, 'nombre'))}</button>`).join('');

    const platos = datos.platos.filter((p) => p.cat === catActiva);
    $('[data-carta]').innerHTML = platos.map((p) => {
      const etiquetas = [
        p.picante ? `<span class="etiqueta picante">${'🌶️'.repeat(p.picante)} ${CE.t('carta.picante')}</span>` : '',
        p.vegano ? `<span class="etiqueta veg">🌱 ${CE.t('carta.vegano')}</span>`
          : p.veg ? `<span class="etiqueta veg">🌿 ${CE.t('carta.veg')}</span>` : '',
      ].join('');
      return `<article class="plato${p.foto ? ' con-foto' : ''}${p.destacado ? ' destacado' : ''}">
        ${p.foto ? `<img src="${esc(p.foto)}" alt="" loading="lazy">` : ''}
        <h3>${p.destacado ? '⭐ ' : ''}${esc(CE.tx(p, 'nombre'))}</h3>
        <span class="precio">${CE.precio(p.precio)}</span>
        <p>${esc(CE.tx(p, 'desc'))}</p>
        ${etiquetas ? `<div class="etiquetas">${etiquetas}</div>` : ''}
      </article>`;
    }).join('');
  }

  function pintarGaleria() {
    $('[data-galeria]').innerHTML = datos.fotos.map((f) => `
      <figure class="foto aparece visible" style="--c:${esc(f.color || '')}">
        ${f.url ? `<img src="${esc(f.url)}" alt="${esc(CE.tx(f, 'texto'))}" loading="lazy">` : `<span class="emoji" aria-hidden="true">${f.emoji || '🌮'}</span>`}
        <figcaption>${esc(CE.tx(f, 'texto'))}</figcaption>
      </figure>`).join('');
  }

  function pintarHorario() {
    $('[data-horario]').innerHTML = (a.horario || []).map((h) =>
      `<tr><td>${esc(CE.tx(h, 'dias'))}</td><td>${esc(h.horas)}</td></tr>`).join('');
  }

  $('[data-pestanas]').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cat]');
    if (!b) return;
    catActiva = b.dataset.cat;
    pintarCarta();
  });

  function pintarTodo() { pintarCarta(); pintarGaleria(); pintarHorario(); }
  document.addEventListener('idioma', pintarTodo);
  CE.aplicarIdioma(); // aplica textos y dispara pintarTodo

  // Aparición al hacer scroll
  const io = new IntersectionObserver((entradas) => entradas.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  $$('.aparece').forEach((el) => io.observe(el));
})();
