// Panel de administración: carta, fotos, datos del local, cara del jefe y juegos.
// Usa supabase-js (vendor/supabase.js). La seguridad real está en las políticas RLS del esquema.
(async () => {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = CE.esc;
  const L = (es, de) => (CE.idioma === 'de' ? de : es);
  const raiz = $('#admin');
  CE.montarIdiomas();

  const aviso = (txt, error = false) => {
    const a = $('#aviso');
    a.textContent = txt; a.className = `aviso-flotante visible${error ? ' error' : ''}`;
    clearTimeout(aviso.t); aviso.t = setTimeout(() => { a.className = 'aviso-flotante'; }, 3200);
  };
  const fallo = (e) => { console.error(e); aviso(`⚠️ ${e.message || e}`, true); };
  const comprobar = ({ data, error }) => { if (error) throw error; return data; };

  if (!CE.api.activo) {
    raiz.innerHTML = `<div class="caja-admin"><h1>⚙️ ${L('Falta conectar Supabase', 'Supabase ist noch nicht verbunden')}</h1>
      <p>${L('Rellena supabaseUrl y supabaseKey en public/js/config.js (ver README).', 'Trage supabaseUrl und supabaseKey in public/js/config.js ein (siehe README).')}</p></div>`;
    CE.aplicarIdioma();
    return;
  }

  const sb = supabase.createClient(CE.config.supabaseUrl, CE.config.supabaseKey);
  let pestana = 'carta';
  let estado = { ajustes: null, categorias: [], platos: [], fotos: [], premios: [], catActiva: null };

  // ---------- Imágenes: se reducen en el navegador antes de subirlas ----------
  async function reducir(archivo, max = 1600, cuadrado = false) {
    const bmp = await createImageBitmap(archivo);
    let sx = 0; let sy = 0; let sw = bmp.width; let sh = bmp.height;
    if (cuadrado) { const lado = Math.min(sw, sh); sx = (sw - lado) / 2; sy = (sh - lado) / 2; sw = lado; sh = lado; }
    const escala = Math.min(1, max / Math.max(sw, sh));
    const c = document.createElement('canvas');
    c.width = Math.round(sw * escala); c.height = Math.round(sh * escala);
    c.getContext('2d').drawImage(bmp, sx, sy, sw, sh, 0, 0, c.width, c.height);
    return new Promise((ok) => c.toBlob(ok, 'image/webp', 0.82));
  }
  async function subir(archivo, carpeta, opciones) {
    const blob = await reducir(archivo, opciones?.max, opciones?.cuadrado);
    const ruta = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
    comprobar(await sb.storage.from('fotos').upload(ruta, blob, { contentType: 'image/webp', cacheControl: '31536000' }));
    return { ruta, url: sb.storage.from('fotos').getPublicUrl(ruta).data.publicUrl };
  }
  const rutaDeUrl = (url) => (url && url.includes('/storage/v1/object/public/fotos/') ? url.split('/storage/v1/object/public/fotos/')[1] : null);
  const borrarArchivo = async (url) => { const r = rutaDeUrl(url); if (r) await sb.storage.from('fotos').remove([r]); };

  // ---------- Sesión ----------
  function pintarLogin(mensaje = '') {
    $('[data-salir]').hidden = true;
    raiz.innerHTML = `<form class="caja-admin login" data-login>
      <h1>🔐 ${L('Administración', 'Verwaltung')}</h1>
      <label>${L('Email', 'E-Mail')}<input type="email" name="email" required autocomplete="username"></label>
      <label>${L('Contraseña', 'Passwort')}<input type="password" name="clave" required autocomplete="current-password"></label>
      <button class="boton" type="submit">${L('Entrar', 'Anmelden')}</button>
      <button class="enlace" type="button" data-olvido>${L('He olvidado la contraseña', 'Passwort vergessen')}</button>
      <p class="error">${esc(mensaje)}</p>
    </form>`;
  }
  raiz.addEventListener('submit', async (e) => {
    if (!e.target.matches('[data-login]')) return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const { error } = await sb.auth.signInWithPassword({ email: d.email, password: d.clave });
    if (error) pintarLogin(L('Email o contraseña incorrectos.', 'E-Mail oder Passwort falsch.'));
    else iniciar();
  });
  raiz.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-olvido]')) return;
    const email = $('[name=email]', raiz)?.value;
    if (!email) { aviso(L('Escribe primero tu email.', 'Gib zuerst deine E-Mail ein.'), true); return; }
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] });
    aviso(error ? error.message : L('Te hemos enviado un email para cambiar la contraseña.', 'Wir haben dir eine E-Mail zum Zurücksetzen geschickt.'), !!error);
  });
  $('[data-salir]').addEventListener('click', async () => { await sb.auth.signOut(); pintarLogin(); });

  // Enlace del email de "contraseña olvidada": pedir la nueva
  sb.auth.onAuthStateChange(async (evento) => {
    if (evento !== 'PASSWORD_RECOVERY') return;
    const nueva = prompt(L('Escribe tu nueva contraseña (mínimo 8 caracteres):', 'Neues Passwort (mindestens 8 Zeichen):'));
    if (nueva && nueva.length >= 8) {
      const { error } = await sb.auth.updateUser({ password: nueva });
      aviso(error ? error.message : L('Contraseña cambiada.', 'Passwort geändert.'), !!error);
    }
  });

  async function iniciar() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return pintarLogin();
    const { data: esAdmin } = await sb.rpc('es_admin');
    if (!esAdmin) {
      raiz.innerHTML = `<div class="caja-admin"><h1>⛔ ${L('Sin permiso', 'Keine Berechtigung')}</h1>
        <p>${L('Tu cuenta no es de administrador. Ver README → "Hacerse administrador".', 'Dein Konto ist kein Admin-Konto. Siehe README → „Admin werden".')}</p></div>`;
      $('[data-salir]').hidden = false;
      return;
    }
    $('[data-salir]').hidden = false;
    $('[data-salir]').textContent = `⎋ ${L('Salir', 'Abmelden')}`;
    await recargar();
  }

  async function recargar() {
    try {
      const [aj, cats, platos, fotos, premios] = await Promise.all([
        sb.from('ajustes').select('*').eq('id', 1).maybeSingle(),
        sb.from('categorias').select('*').order('orden'),
        sb.from('platos').select('*').order('orden'),
        sb.from('fotos').select('*').order('orden'),
        sb.from('premios').select('*').order('orden'),
      ]);
      estado.ajustes = comprobar(aj) || { id: 1, nombre: 'Restaurante', horario: [] };
      estado.categorias = comprobar(cats);
      estado.platos = comprobar(platos);
      estado.fotos = comprobar(fotos);
      estado.premios = comprobar(premios);
      CE.ajustes = estado.ajustes;
      if (!estado.categorias.some((c) => c.id === estado.catActiva)) estado.catActiva = estado.categorias[0]?.id;
      pintar();
    } catch (e) { fallo(e); }
  }

  // ---------- Estructura ----------
  const PESTANAS = [
    ['carta', '🌮', 'Carta', 'Speisekarte'], ['fotos', '📸', 'Fotos', 'Fotos'], ['datos', '🏠', 'Datos y horario', 'Daten & Zeiten'],
    ['jefe', '🧔', 'Cara del jefe', 'Chef-Gesicht'], ['juegos', '🏆', 'Juegos y ranking', 'Spiele & Ranking'],
  ];
  function pintar() {
    $('[data-titulo]').textContent = L('Administración', 'Verwaltung');
    raiz.innerHTML = `<nav class="admin-pestanas">${PESTANAS.map(([id, ico, es, de]) =>
      `<button type="button" data-pestana="${id}" aria-pressed="${id === pestana}">${ico} ${L(es, de)}</button>`).join('')}
      <a class="ver-web" href="../" target="_blank">↗ ${L('Ver la web', 'Website ansehen')}</a></nav>
      <section id="panel"></section>`;
    ({ carta: pintarCarta, fotos: pintarFotos, datos: pintarDatos, jefe: pintarJefe, juegos: pintarJuegos })[pestana]();
  }
  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pestana]');
    if (b) { pestana = b.dataset.pestana; pintar(); }
  });
  document.addEventListener('idioma', () => { if (estado.ajustes) pintar(); else if ($('[data-login]')) pintarLogin(); });

  // Intercambia el orden de dos filas de una tabla
  async function moverFila(tabla, lista, id, dir) {
    const i = lista.findIndex((x) => String(x.id) === String(id));
    const j = i + dir;
    if (i < 0 || j < 0 || j >= lista.length) return;
    const [a, b] = [lista[i], lista[j]];
    const oa = a.orden; const ob = b.orden === oa ? oa + dir : b.orden;
    comprobar(await sb.from(tabla).update({ orden: ob }).eq('id', a.id));
    comprobar(await sb.from(tabla).update({ orden: oa }).eq('id', b.id));
    await recargar();
  }

  // ---------- Carta ----------
  function pintarCarta() {
    const p = $('#panel');
    const cat = estado.categorias.find((c) => c.id === estado.catActiva);
    const platos = estado.platos.filter((x) => x.cat === estado.catActiva);
    p.innerHTML = `
      <div class="fila-herramientas">
        <div class="chips">${estado.categorias.map((c) => `<button type="button" data-cat="${esc(c.id)}" aria-pressed="${c.id === estado.catActiva}">${c.icono || ''} ${esc(CE.tx(c, 'nombre'))} <small>${estado.platos.filter((x) => x.cat === c.id).length}</small></button>`).join('')}</div>
        <button class="boton pequeno contorno" type="button" data-editar-cats>🗂️ ${L('Categorías', 'Kategorien')}</button>
      </div>
      ${cat ? `<div class="cabeza-lista"><h2>${cat.icono || ''} ${esc(CE.tx(cat, 'nombre'))}</h2>
        <button class="boton" type="button" data-nuevo-plato>＋ ${L('Añadir plato', 'Gericht hinzufügen')}</button></div>` : ''}
      <ul class="lista-admin">${platos.map((x, i) => `
        <li class="${x.visible ? '' : 'oculto'}">
          <span class="mover"><button type="button" data-mover-plato="${x.id}" data-dir="-1" ${i ? '' : 'disabled'} aria-label="↑">↑</button><button type="button" data-mover-plato="${x.id}" data-dir="1" ${i < platos.length - 1 ? '' : 'disabled'} aria-label="↓">↓</button></span>
          ${x.foto ? `<img src="${esc(x.foto.startsWith('http') ? x.foto : `../${x.foto}`)}" alt="">` : ''}
          <span class="nombre"><b>${esc(x.nombre_es)}</b>${x.nombre_de && x.nombre_de !== x.nombre_es ? `<small>${esc(x.nombre_de)}</small>` : ''}
            ${x.sub_es ? `<small class="sub">${esc(x.sub_es)}</small>` : ''}</span>
          <span class="precio">${x.variantes?.length ? `${x.variantes.length} ${L('opciones', 'Varianten')}` : CE.precio(x.precio)}</span>
          <span class="marcas">${x.destacado ? '⭐' : ''}${x.picante ? '🌶️' : ''}${x.vegano ? '🌱' : x.veg ? '🌿' : ''}</span>
          <span class="acciones">
            <button type="button" data-visible="${x.id}" title="${L('Mostrar/ocultar', 'Ein-/ausblenden')}">${x.visible ? '👁️' : '🚫'}</button>
            <button type="button" data-editar-plato="${x.id}" title="${L('Editar', 'Bearbeiten')}">✏️</button>
            <button type="button" data-borrar-plato="${x.id}" title="${L('Borrar', 'Löschen')}">🗑️</button>
          </span>
        </li>`).join('')}</ul>
      ${cat && !platos.length ? `<p class="vacio">${L('Esta categoría está vacía.', 'Diese Kategorie ist leer.')}</p>` : ''}`;
  }

  function formularioPlato(pl) {
    const v = pl || { cat: estado.catActiva, visible: true, picante: 0, variantes: [], precio: 0 };
    const campo = (n, es, de, tipo = 'text', extra = '') => `<label>${L(es, de)}<input type="${tipo}" name="${n}" value="${esc(v[n] ?? '')}" ${extra}></label>`;
    const area = (n, es, de) => `<label>${L(es, de)}<textarea name="${n}" rows="2">${esc(v[n] ?? '')}</textarea></label>`;
    const dlg = document.createElement('dialog');
    dlg.className = 'dialogo';
    dlg.innerHTML = `<form method="dialog" class="form-admin" data-form-plato>
      <h2>${pl ? L('Editar plato', 'Gericht bearbeiten') : L('Nuevo plato', 'Neues Gericht')}</h2>
      <div class="dos">${campo('nombre_es', 'Nombre 🇲🇽', 'Name 🇲🇽', 'text', 'required')}${campo('nombre_de', 'Nombre 🇩🇪 (si cambia)', 'Name 🇩🇪 (falls anders)')}</div>
      <div class="dos">${area('desc_es', 'Descripción 🇲🇽', 'Beschreibung 🇲🇽')}${area('desc_de', 'Descripción 🇩🇪', 'Beschreibung 🇩🇪')}</div>
      <div class="tres">
        ${campo('precio', 'Precio (€)', 'Preis (€)', 'number', 'step="0.1" min="0" required')}
        <label>${L('Categoría', 'Kategorie')}<select name="cat">${estado.categorias.map((c) => `<option value="${esc(c.id)}" ${c.id === v.cat ? 'selected' : ''}>${esc(c.nombre_es)}</option>`).join('')}</select></label>
        <label>${L('Picante', 'Schärfe')}<select name="picante">${[0, 1, 2, 3].map((n) => `<option value="${n}" ${Number(v.picante) === n ? 'selected' : ''}>${n ? '🌶️'.repeat(n) : L('No pica', 'Nicht scharf')}</option>`).join('')}</select></label>
      </div>
      <div class="dos">${campo('sub_es', 'Subsección 🇲🇽 (opcional)', 'Unterabschnitt 🇲🇽 (optional)')}${campo('sub_de', 'Subsección 🇩🇪', 'Unterabschnitt 🇩🇪')}</div>
      <div class="dos">${campo('opciones_es', 'Opciones 🇲🇽 (p. ej. sabores)', 'Optionen 🇲🇽 (z. B. Sorten)')}${campo('opciones_de', 'Opciones 🇩🇪', 'Optionen 🇩🇪')}</div>
      <fieldset class="marcas-form">
        ${[['veg', '🌿 Vegetariano', '🌿 Vegetarisch'], ['vegano', '🌱 Vegano', '🌱 Vegan'], ['destacado', '⭐ Favorito (sale en portada)', '⭐ Favorit (auf der Startseite)'], ['visible', '👁️ Visible en la carta', '👁️ Auf der Karte sichtbar']]
          .map(([n, es, de]) => `<label class="check"><input type="checkbox" name="${n}" ${v[n] ? 'checked' : ''}> ${L(es, de)}</label>`).join('')}
      </fieldset>
      <fieldset><legend>${L('Variantes con precio propio (opcional)', 'Varianten mit eigenem Preis (optional)')}</legend>
        <div class="variantes-admin" data-variantes>${(v.variantes || []).map(filaVariante).join('')}</div>
        <button class="enlace" type="button" data-nueva-variante>＋ ${L('Añadir variante', 'Variante hinzufügen')}</button>
      </fieldset>
      <fieldset><legend>${L('Foto (opcional)', 'Foto (optional)')}</legend>
        <div class="foto-plato">${v.foto ? `<img src="${esc(v.foto.startsWith('http') ? v.foto : `../${v.foto}`)}" alt="">` : ''}
          <input type="file" accept="image/*" name="archivo">
          ${v.foto ? `<label class="check"><input type="checkbox" name="quitar_foto"> ${L('Quitar foto', 'Foto entfernen')}</label>` : ''}</div>
      </fieldset>
      <div class="botones-dialogo">
        <button class="boton contorno" type="button" data-cerrar>${L('Cancelar', 'Abbrechen')}</button>
        <button class="boton" type="submit">💾 ${L('Guardar', 'Speichern')}</button>
      </div>
    </form>`;
    document.body.appendChild(dlg);
    dlg.showModal();
    dlg.addEventListener('close', () => dlg.remove());
    dlg.addEventListener('click', (e) => {
      if (e.target.closest('[data-cerrar]')) dlg.close();
      if (e.target.closest('[data-nueva-variante]')) $('[data-variantes]', dlg).insertAdjacentHTML('beforeend', filaVariante({}));
      if (e.target.closest('[data-quitar-variante]')) e.target.closest('.variante').remove();
    });
    $('form', dlg).addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const d = Object.fromEntries(new FormData(f));
      const boton = $('[type=submit]', f); boton.disabled = true;
      try {
        const variantes = [...f.querySelectorAll('.variante')].map((r) => ({
          es: $('[data-v=es]', r).value.trim(), de: $('[data-v=de]', r).value.trim() || null, precio: Number($('[data-v=precio]', r).value) || 0,
        })).filter((x) => x.es);
        const fila = {
          cat: d.cat, nombre_es: d.nombre_es.trim(), nombre_de: d.nombre_de.trim() || null,
          desc_es: d.desc_es.trim() || null, desc_de: d.desc_de.trim() || null,
          precio: variantes.length ? Math.min(...variantes.map((x) => x.precio)) : Number(d.precio) || 0,
          sub_es: d.sub_es.trim() || null, sub_de: d.sub_de.trim() || null,
          opciones_es: d.opciones_es.trim() || null, opciones_de: d.opciones_de.trim() || null,
          picante: Number(d.picante) || 0, veg: !!d.veg, vegano: !!d.vegano, destacado: !!d.destacado, visible: !!d.visible, variantes,
        };
        const archivo = f.archivo.files[0];
        if (archivo) { if (v.foto) await borrarArchivo(v.foto); fila.foto = (await subir(archivo, 'platos', { max: 900 })).url; }
        else if (d.quitar_foto) { await borrarArchivo(v.foto); fila.foto = null; }
        if (pl) comprobar(await sb.from('platos').update(fila).eq('id', pl.id));
        else {
          fila.orden = Math.max(0, ...estado.platos.filter((x) => x.cat === fila.cat).map((x) => x.orden)) + 1;
          comprobar(await sb.from('platos').insert(fila));
        }
        dlg.close();
        aviso(`✅ ${L('Guardado', 'Gespeichert')}`);
        estado.catActiva = fila.cat;
        await recargar();
      } catch (err) { fallo(err); boton.disabled = false; }
    });
  }
  function filaVariante(x) {
    return `<div class="variante"><input data-v="es" placeholder="🇲🇽 ${L('p. ej. Pollo', 'z. B. Pollo')}" value="${esc(x.es || '')}">
      <input data-v="de" placeholder="🇩🇪 ${L('p. ej. Hähnchen', 'z. B. Hähnchen')}" value="${esc(x.de || '')}">
      <input data-v="precio" type="number" step="0.1" min="0" placeholder="€" value="${esc(x.precio ?? '')}">
      <button type="button" data-quitar-variante aria-label="✕">✕</button></div>`;
  }

  function editorCategorias() {
    const dlg = document.createElement('dialog');
    dlg.className = 'dialogo';
    const filas = () => estado.categorias.map((c, i) => `<div class="cat-fila" data-id="${esc(c.id)}">
      <span class="mover"><button type="button" data-mover-cat="${esc(c.id)}" data-dir="-1" ${i ? '' : 'disabled'}>↑</button><button type="button" data-mover-cat="${esc(c.id)}" data-dir="1" ${i < estado.categorias.length - 1 ? '' : 'disabled'}>↓</button></span>
      <input name="icono" value="${esc(c.icono || '')}" class="icono" aria-label="Icono">
      <input name="nombre_es" value="${esc(c.nombre_es)}" aria-label="🇲🇽">
      <input name="nombre_de" value="${esc(c.nombre_de || '')}" aria-label="🇩🇪" placeholder="🇩🇪">
      <select name="grupo"><option value="comida" ${c.grupo === 'comida' ? 'selected' : ''}>${L('Comer', 'Essen')}</option><option value="bebida" ${c.grupo === 'bebida' ? 'selected' : ''}>${L('Beber', 'Trinken')}</option></select>
      <label class="check" title="${L('Lista compacta', 'Kompakte Liste')}"><input type="checkbox" name="lista" ${c.lista ? 'checked' : ''}> ≡</label>
      <input name="nota_es" value="${esc(c.nota_es || '')}" placeholder="${L('Nota 🇲🇽 (opcional)', 'Hinweis 🇲🇽 (optional)')}" class="ancho">
      <input name="nota_de" value="${esc(c.nota_de || '')}" placeholder="${L('Nota 🇩🇪', 'Hinweis 🇩🇪')}" class="ancho">
      <button type="button" data-guardar-cat="${esc(c.id)}">💾</button>
      <button type="button" data-borrar-cat="${esc(c.id)}">🗑️</button>
    </div>`).join('');
    const pintarDlg = () => {
      dlg.innerHTML = `<div class="form-admin"><h2>🗂️ ${L('Categorías de la carta', 'Kategorien der Karte')}</h2>
        <div class="cats-admin">${filas()}</div>
        <form class="nueva-cat" data-nueva-cat>
          <input name="id" required pattern="[a-z0-9-]+" placeholder="${L('id (p. ej. tortas)', 'ID (z. B. tortas)')}">
          <input name="nombre_es" required placeholder="${L('Nombre 🇲🇽', 'Name 🇲🇽')}">
          <button class="boton pequeno" type="submit">＋ ${L('Crear', 'Anlegen')}</button>
        </form>
        <div class="botones-dialogo"><button class="boton contorno" type="button" data-cerrar>${L('Cerrar', 'Schließen')}</button></div></div>`;
    };
    pintarDlg();
    document.body.appendChild(dlg);
    dlg.showModal();
    dlg.addEventListener('close', () => { dlg.remove(); pintar(); });
    dlg.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      try {
        if ('cerrar' in b.dataset) dlg.close();
        if (b.dataset.guardarCat) {
          const r = b.closest('.cat-fila');
          const val = (n) => $(`[name=${n}]`, r);
          comprobar(await sb.from('categorias').update({
            icono: val('icono').value.trim() || null, nombre_es: val('nombre_es').value.trim(), nombre_de: val('nombre_de').value.trim() || null,
            grupo: val('grupo').value, lista: val('lista').checked, nota_es: val('nota_es').value.trim() || null, nota_de: val('nota_de').value.trim() || null,
          }).eq('id', b.dataset.guardarCat));
          aviso(`✅ ${L('Guardado', 'Gespeichert')}`); await recargar(); pintarDlg();
        }
        if (b.dataset.borrarCat) {
          if (estado.platos.some((x) => x.cat === b.dataset.borrarCat)) { aviso(L('Primero vacía o mueve sus platos.', 'Zuerst die Gerichte löschen oder verschieben.'), true); return; }
          if (!confirm(L('¿Borrar esta categoría?', 'Diese Kategorie löschen?'))) return;
          comprobar(await sb.from('categorias').delete().eq('id', b.dataset.borrarCat)); await recargar(); pintarDlg();
        }
        if (b.dataset.moverCat) { await moverFila('categorias', estado.categorias, b.dataset.moverCat, Number(b.dataset.dir)); pintarDlg(); }
      } catch (err) { fallo(err); }
    });
    dlg.addEventListener('submit', async (e) => {
      if (!e.target.matches('[data-nueva-cat]')) return;
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      try {
        comprobar(await sb.from('categorias').insert({ id: d.id.trim(), nombre_es: d.nombre_es.trim(), grupo: 'comida', orden: estado.categorias.length }));
        await recargar(); pintarDlg();
      } catch (err) { fallo(err); }
    });
  }

  raiz.addEventListener('click', async (e) => {
    if (pestana !== 'carta') return;
    const b = e.target.closest('button'); if (!b) return;
    try {
      if (b.dataset.cat) { estado.catActiva = b.dataset.cat; pintarCarta(); }
      else if ('editarCats' in b.dataset) editorCategorias();
      else if ('nuevoPlato' in b.dataset) formularioPlato(null);
      else if (b.dataset.editarPlato) formularioPlato(estado.platos.find((x) => String(x.id) === b.dataset.editarPlato));
      else if (b.dataset.visible) {
        const pl = estado.platos.find((x) => String(x.id) === b.dataset.visible);
        comprobar(await sb.from('platos').update({ visible: !pl.visible }).eq('id', pl.id)); await recargar();
      } else if (b.dataset.borrarPlato) {
        const pl = estado.platos.find((x) => String(x.id) === b.dataset.borrarPlato);
        if (!confirm(`${L('¿Borrar', 'Löschen:')} "${pl.nombre_es}"?`)) return;
        await borrarArchivo(pl.foto);
        comprobar(await sb.from('platos').delete().eq('id', pl.id)); await recargar();
      } else if (b.dataset.moverPlato) {
        await moverFila('platos', estado.platos.filter((x) => x.cat === estado.catActiva), b.dataset.moverPlato, Number(b.dataset.dir));
      }
    } catch (err) { fallo(err); }
  });

  // ---------- Fotos ----------
  function pintarFotos() {
    $('#panel').innerHTML = `
      <div class="cabeza-lista"><h2>📸 ${L('Galería de la portada', 'Galerie der Startseite')}</h2>
        <label class="boton">＋ ${L('Subir fotos', 'Fotos hochladen')}<input type="file" accept="image/*" multiple data-subir-fotos hidden></label></div>
      <p class="ayuda">${L('Las fotos se reducen automáticamente. Usa solo fotos propias o con permiso.', 'Fotos werden automatisch verkleinert. Nur eigene Fotos oder mit Erlaubnis verwenden.')}</p>
      <div class="rejilla-fotos">${estado.fotos.map((f, i) => `
        <div class="foto-admin" data-id="${f.id}">
          <img src="${esc(f.url.startsWith('http') ? f.url : `../${f.url}`)}" alt="">
          <input data-campo="texto_es" value="${esc(f.texto_es || '')}" placeholder="🇲🇽 ${L('Pie de foto', 'Bildunterschrift')}">
          <input data-campo="texto_de" value="${esc(f.texto_de || '')}" placeholder="🇩🇪 ${L('Pie de foto', 'Bildunterschrift')}">
          <div class="acciones">
            <button type="button" data-mover-foto="${f.id}" data-dir="-1" ${i ? '' : 'disabled'}>←</button>
            <button type="button" data-mover-foto="${f.id}" data-dir="1" ${i < estado.fotos.length - 1 ? '' : 'disabled'}>→</button>
            <button type="button" data-ancho="${f.id}" title="${L('Grande / normal', 'Groß / normal')}">${f.ancho === 2 ? '⬛' : '▪️'}</button>
            <button type="button" data-borrar-foto="${f.id}">🗑️</button>
          </div>
        </div>`).join('')}</div>`;
  }
  raiz.addEventListener('change', async (e) => {
    if (pestana === 'fotos' && e.target.matches('[data-subir-fotos]')) {
      const archivos = [...e.target.files];
      aviso(`⏳ ${L('Subiendo', 'Lade hoch')} ${archivos.length}…`);
      try {
        let orden = Math.max(0, ...estado.fotos.map((f) => f.orden));
        for (const a of archivos) {
          const { url, ruta } = await subir(a, 'galeria');
          comprobar(await sb.from('fotos').insert({ url, ruta, orden: ++orden }));
        }
        aviso(`✅ ${L('Fotos subidas', 'Fotos hochgeladen')}`); await recargar();
      } catch (err) { fallo(err); }
    } else if (pestana === 'fotos' && e.target.dataset.campo) {
      const id = e.target.closest('.foto-admin').dataset.id;
      try { comprobar(await sb.from('fotos').update({ [e.target.dataset.campo]: e.target.value.trim() || null }).eq('id', id)); aviso(`✅ ${L('Guardado', 'Gespeichert')}`); } catch (err) { fallo(err); }
    }
  });
  raiz.addEventListener('click', async (e) => {
    if (pestana !== 'fotos') return;
    const b = e.target.closest('button'); if (!b) return;
    try {
      if (b.dataset.moverFoto) await moverFila('fotos', estado.fotos, b.dataset.moverFoto, Number(b.dataset.dir));
      if (b.dataset.ancho) { const f = estado.fotos.find((x) => String(x.id) === b.dataset.ancho); comprobar(await sb.from('fotos').update({ ancho: f.ancho === 2 ? 1 : 2 }).eq('id', f.id)); await recargar(); }
      if (b.dataset.borrarFoto) {
        if (!confirm(L('¿Borrar esta foto?', 'Dieses Foto löschen?'))) return;
        const f = estado.fotos.find((x) => String(x.id) === b.dataset.borrarFoto);
        if (f.ruta) await sb.storage.from('fotos').remove([f.ruta]);
        comprobar(await sb.from('fotos').delete().eq('id', f.id)); await recargar();
      }
    } catch (err) { fallo(err); }
  });

  // ---------- Datos y horario ----------
  function pintarDatos() {
    const a = estado.ajustes;
    const campo = (n, es, de, tipo = 'text') => `<label>${L(es, de)}<input type="${tipo}" name="${n}" value="${esc(a[n] ?? '')}"></label>`;
    $('#panel').innerHTML = `<form class="form-admin caja-admin" data-form-datos>
      <h2>🏠 ${L('Datos del restaurante', 'Daten des Restaurants')}</h2>
      <div class="dos">${campo('nombre', 'Nombre', 'Name')}${campo('instagram', 'Instagram (sin @)', 'Instagram (ohne @)')}</div>
      <div class="dos">${campo('eslogan_es', 'Eslogan 🇲🇽', 'Slogan 🇲🇽')}${campo('eslogan_de', 'Eslogan 🇩🇪', 'Slogan 🇩🇪')}</div>
      <div class="dos">${campo('direccion', 'Dirección', 'Adresse')}${campo('cp_ciudad', 'CP y ciudad', 'PLZ & Ort')}</div>
      <div class="dos">${campo('telefono', 'Teléfono', 'Telefon', 'tel')}${campo('email', 'Email', 'E-Mail', 'email')}</div>
      <div class="dos">${campo('reserva_url', 'Enlace de reservas (TheFork…)', 'Reservierungslink (TheFork…)', 'url')}${campo('maps_url', 'Enlace de Google Maps', 'Google-Maps-Link', 'url')}</div>
      <div class="tres">${campo('valoracion', 'Nota (p. ej. 9,0)', 'Bewertung (z. B. 9,0)')}${campo('valoracion_opiniones', 'Nº de opiniones', 'Anzahl Bewertungen', 'number')}${campo('valoracion_fuente', 'Fuente (TheFork, Google…)', 'Quelle (TheFork, Google…)')}</div>
      <fieldset><legend>🕒 ${L('Horario', 'Öffnungszeiten')}</legend>
        <p class="ayuda">${L('Formato 17:00. Para medianoche escribe 24:00; si cierras más tarde, p. ej. 01:00.', 'Format 17:00. Für Mitternacht 24:00 eintragen; bei späterem Schluss z. B. 01:00.')}</p>
        <div class="semana">${[1, 2, 3, 4, 5, 6, 0].map((d) => filaDia(d, CE.horario.valido(a.horario) ? a.horario[d] : null)).join('')}</div>
      </fieldset>
      <button class="boton" type="submit">💾 ${L('Guardar', 'Speichern')}</button>
    </form>`;
  }
  function filaDia(d, t) {
    return `<div class="dia" data-dia="${d}">
      <label class="check"><input type="checkbox" data-abierto ${t ? 'checked' : ''}> ${CE.horario.nombreDia(d)}</label>
      <input data-abre value="${esc(t?.[0] || '17:00')}" aria-label="${L('Abre', 'Öffnet')}">
      <span>–</span>
      <input data-cierra value="${esc(t?.[1] || '24:00')}" aria-label="${L('Cierra', 'Schließt')}">
    </div>`;
  }
  raiz.addEventListener('submit', async (e) => {
    if (!e.target.matches('[data-form-datos]')) return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const horario = Array(7).fill(null);
    const formato = /^([01]?\d|2[0-4]):[0-5]\d$/;
    let malo = false;
    e.target.querySelectorAll('.dia').forEach((r) => {
      if (!$('[data-abierto]', r).checked) return;
      const t = [$('[data-abre]', r).value.trim(), $('[data-cierra]', r).value.trim()];
      if (!formato.test(t[0]) || !formato.test(t[1])) malo = true;
      horario[Number(r.dataset.dia)] = t;
    });
    if (malo) { aviso(L('Revisa el horario: formato 17:00.', 'Öffnungszeiten prüfen: Format 17:00.'), true); return; }
    const cambios = { ...d, valoracion_opiniones: d.valoracion_opiniones ? Number(d.valoracion_opiniones) : null, horario, actualizado: new Date().toISOString() };
    Object.keys(cambios).forEach((k) => { if (cambios[k] === '') cambios[k] = null; });
    cambios.instagram = (cambios.instagram || '').replace(/^@/, '') || null;
    try { comprobar(await sb.from('ajustes').upsert({ id: 1, ...cambios })); aviso(`✅ ${L('Guardado', 'Gespeichert')}`); await recargar(); } catch (err) { fallo(err); }
  });

  // ---------- Cara del jefe ----------
  function pintarJefe() {
    $('#panel').innerHTML = `<div class="caja-admin jefe-admin">
      <h2>🧔 ${L('La cara del jefe en los juegos', 'Das Gesicht vom Chef in den Spielen')}</h2>
      <div class="jefe-vista">${CE.jefeHtml('grande')}
        <svg viewBox="0 0 200 200" class="jefe-ruleta" aria-hidden="true"><circle cx="100" cy="100" r="96" fill="#d42d3b"/>${CE.jefeEnSvg(100, 104, 120, 'adm')}</svg></div>
      <p>${L('Sube una foto de frente, bien iluminada y con la cara centrada. Se recorta en cuadrado y se muestra en círculo en el ahorcado, la ruleta y las pantallas de fin de partida.',
        'Lade ein gut beleuchtetes Foto von vorne mit zentriertem Gesicht hoch. Es wird quadratisch zugeschnitten und rund im Galgenmännchen, im Glücksrad und am Spielende gezeigt.')}</p>
      <p class="ayuda">⚠️ ${L('Hace falta el consentimiento por escrito de la persona que sale en la foto.', 'Die abgebildete Person muss schriftlich zustimmen.')}</p>
      <div class="botones-dialogo">
        <label class="boton">📷 ${L('Subir foto', 'Foto hochladen')}<input type="file" accept="image/*" data-subir-jefe hidden></label>
        ${estado.ajustes.cara_jefe ? `<button class="boton contorno" type="button" data-quitar-jefe>${L('Usar el jefe dibujado', 'Gezeichneten Chef verwenden')}</button>` : ''}
      </div></div>`;
  }
  raiz.addEventListener('change', async (e) => {
    if (pestana !== 'jefe' || !e.target.matches('[data-subir-jefe]')) return;
    try {
      aviso(`⏳ ${L('Subiendo…', 'Lade hoch…')}`);
      const { url } = await subir(e.target.files[0], 'jefe', { max: 512, cuadrado: true });
      const anterior = estado.ajustes.cara_jefe;
      comprobar(await sb.from('ajustes').update({ cara_jefe: url }).eq('id', 1));
      await borrarArchivo(anterior);
      aviso(`✅ ${L('¡Listo! Ya sale en los juegos.', 'Fertig! Jetzt in den Spielen.')}`); await recargar();
    } catch (err) { fallo(err); }
  });
  raiz.addEventListener('click', async (e) => {
    if (pestana !== 'jefe' || !e.target.closest('[data-quitar-jefe]')) return;
    try { await borrarArchivo(estado.ajustes.cara_jefe); comprobar(await sb.from('ajustes').update({ cara_jefe: null }).eq('id', 1)); await recargar(); } catch (err) { fallo(err); }
  });

  // ---------- Juegos: código del día, premios, ruleta y moderación ----------
  const juegosRanking = CE.catalogo.filter((j) => j.ranking);
  let moderar = { juego: '', periodo: 'semana' };

  async function pintarJuegos() {
    const a = estado.ajustes;
    let codigo = '';
    try { codigo = comprobar(await sb.from('secretos').select('codigo_juego').eq('id', 1).maybeSingle())?.codigo_juego || ''; } catch (e) { fallo(e); }
    $('#panel').innerHTML = `
      <form class="form-admin caja-admin" data-form-codigo>
        <h2>🔑 ${L('Código del día', 'Code des Tages')}</h2>
        <p class="ayuda">${L('Si lo activas, para entrar en el ranking hay que escribir este código. Ponlo en las mesas o en la pizarra: así solo puntúa quien está en el local.',
          'Wenn aktiviert, braucht man diesen Code fürs Ranking. Schreib ihn auf die Tische oder die Tafel: So punkten nur Gäste vor Ort.')}</p>
        <label class="check"><input type="checkbox" name="ranking_con_codigo" ${a.ranking_con_codigo ? 'checked' : ''}> ${L('Pedir código para entrar en el ranking', 'Code fürs Ranking verlangen')}</label>
        <div class="dos"><label>${L('Código', 'Code')}<input name="codigo" value="${esc(codigo)}" maxlength="20" style="text-transform:uppercase"></label>
          <div class="abajo"><button class="boton contorno" type="button" data-generar>🎲 ${L('Generar uno', 'Neuen erzeugen')}</button></div></div>
        <button class="boton" type="submit">💾 ${L('Guardar', 'Speichern')}</button>
      </form>

      <div class="caja-admin qr-admin">
        <h2>📱 ${L('QR para las mesas', 'QR-Code für die Tische')}</h2>
        <p class="ayuda">${L('Lleva a la sala de juegos. Imprime los carteles cuando la web ya esté en el dominio definitivo (si cambia la dirección, hay que volver a imprimirlos).',
          'Führt zum Spielraum. Drucke die Aufsteller erst, wenn die Website unter der endgültigen Domain läuft (ändert sich die Adresse, neu drucken).')}</p>
        <label>${L('Dirección del QR', 'Adresse im QR-Code')}<input data-qr-url value="${esc(urlJuegos())}"></label>
        <div class="qr-vista" data-qr-vista>${svgQr(urlJuegos())}</div>
        <div class="botones-dialogo" style="justify-content:flex-start">
          <button class="boton" type="button" data-imprimir-qr>🖨️ ${L('Imprimir carteles (4 por A4)', 'Aufsteller drucken (4 pro A4)')}</button>
          <button class="boton contorno" type="button" data-descargar-qr>⬇️ ${L('Descargar QR (SVG)', 'QR herunterladen (SVG)')}</button>
        </div>
      </div>

      <form class="form-admin caja-admin" data-form-promo>
        <h2>🎡 ${L('Premio en la ruleta del jefe', 'Preis im Glücksrad vom Chef')}</h2>
        <p class="ayuda">${L('Opcional. Añade una casilla dorada a la ruleta (p. ej. "10 % en la siguiente ronda"). Déjalo vacío para quitarla.',
          'Optional. Fügt dem Glücksrad ein goldenes Feld hinzu (z. B. „10 % auf die nächste Runde"). Leer lassen zum Entfernen.')}</p>
        <div class="dos"><label>🇲🇽<input name="promo_ruleta_es" value="${esc(a.promo_ruleta_es || '')}"></label><label>🇩🇪<input name="promo_ruleta_de" value="${esc(a.promo_ruleta_de || '')}"></label></div>
        <button class="boton" type="submit">💾 ${L('Guardar', 'Speichern')}</button>
      </form>

      <div class="caja-admin">
        <h2>🎁 ${L('Premios de los rankings', 'Preise der Rankings')}</h2>
        <div class="premios-admin">${estado.premios.map(filaPremio).join('')}</div>
        <button class="enlace" type="button" data-nuevo-premio>＋ ${L('Añadir premio', 'Preis hinzufügen')}</button>
      </div>

      <div class="caja-admin">
        <h2>🏆 ${L('Ranking y moderación', 'Ranking & Moderation')}</h2>
        <form class="form-admin" data-form-modo>
          <label>${L('Cómo se suma el ranking general', 'Wie das Gesamtranking zählt')}
            <select name="ranking_modo">
              <option value="mejor" ${a.ranking_modo !== 'suma' ? 'selected' : ''}>${L('La mejor partida de cada juego (recomendado: premia jugar a todos)', 'Beste Runde je Spiel (empfohlen: belohnt, alle zu spielen)')}</option>
              <option value="suma" ${a.ranking_modo === 'suma' ? 'selected' : ''}>${L('Todas las partidas (premia jugar muchas veces)', 'Alle Runden (belohnt, oft zu spielen)')}</option>
            </select></label>
        </form>
        <div class="fila-herramientas">
          <select data-mod-periodo>${['dia', 'semana', 'mes'].map((p) => `<option value="${p}" ${p === moderar.periodo ? 'selected' : ''}>${L({ dia: 'Hoy', semana: 'Esta semana', mes: 'Este mes' }[p], { dia: 'Heute', semana: 'Diese Woche', mes: 'Diesen Monat' }[p])}</option>`).join('')}</select>
          <button class="boton pequeno contorno" type="button" data-copiar>📋 ${L('Copiar el top 3 para Instagram', 'Top 3 für Instagram kopieren')}</button>
        </div>
        <div data-top-global><p class="vacio">…</p></div>
        <h3>${L('Partidas guardadas', 'Gespeicherte Runden')}</h3>
        <div class="fila-herramientas">
          <select data-mod-juego><option value="">${L('Todos los juegos', 'Alle Spiele')}</option>${juegosRanking.map((j) => `<option value="${j.id}" ${j.id === moderar.juego ? 'selected' : ''}>${j.icono} ${esc(CE.tx(j, 'nombre'))}</option>`).join('')}</select>
        </div>
        <div data-moderacion><p class="vacio">…</p></div>
      </div>`;
    cargarModeracion();
  }
  function urlJuegos() { return new URL('../juegos/', location.href).href; }
  function svgQr(url) {
    if (!window.qrcode || !url) return '';
    const qr = qrcode(0, 'M'); qr.addData(url); qr.make();
    return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  }
  async function imprimirCarteles(url) {
    const v = window.open('', '_blank'); // se abre ya, dentro del clic, para que no lo bloquee el navegador
    let logo = '';
    try {
      const blob = await (await fetch(new URL('../assets/logo.png', location.href))).blob();
      logo = await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(blob); });
    } catch (e) { /* sin logo */ }
    const cartel = `<div class="cartel"><img class="logo" src="${logo}" alt="">
      <h1>¡Juega y gana!<small>Spiel &amp; gewinn!</small></h1>
      <div class="qr">${svgQr(url)}</div>
      <p class="juegos">🎲 Pirinola · Cubilete · Lotería · Ruleta del jefe · Ahorcado…</p>
      <p class="codigo">🔑 Código del día / Code des Tages:<span></span></p>
      <p class="pie">🏆 Rankings con premios cada semana · Jede Woche Preise · 18+ 🥤</p></div>`;
    v.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>QR</title><style>
      @page { size: A4; margin: 8mm; } * { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, sans-serif; display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
      .cartel { height: 136mm; border: 1.5px dashed #999; border-radius: 6mm; padding: 6mm; display: flex; flex-direction: column; align-items: center; text-align: center; background: #0d0a08; color: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .logo { width: 28mm; } h1 { margin: 2mm 0; font-size: 22pt; color: #f2a541; line-height: 1; } h1 small { display: block; font-size: 13pt; color: #fff; }
      .qr { background: #fff; padding: 3mm; border-radius: 3mm; width: 52mm; } .qr svg { display: block; width: 100%; height: auto; }
      p { margin: 2mm 0 0; font-size: 9pt; } .codigo span { display: block; margin: 2mm auto 0; width: 45mm; height: 9mm; border: 1.5px solid #f2a541; border-radius: 2mm; background: #fff; }
      .pie { color: #c9b8a6; font-size: 8pt; margin-top: auto; }
    </style></head><body>${cartel.repeat(4)}<script>Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = r; i.onerror = r; })))).then(() => setTimeout(() => print(), 200));<\/script></body></html>`);
    v.document.close();
  }
  function filaPremio(p) {
    return `<div class="premio" data-id="${p.id || ''}">
      <select data-p="periodo">${['dia', 'semana', 'mes'].map((x) => `<option value="${x}" ${p.periodo === x ? 'selected' : ''}>${L({ dia: 'Diario', semana: 'Semanal', mes: 'Mensual' }[x], { dia: 'Täglich', semana: 'Wöchentlich', mes: 'Monatlich' }[x])}</option>`).join('')}</select>
      <input data-p="texto_es" value="${esc(p.texto_es || '')}" placeholder="🇲🇽 ${L('p. ej. Un chupito gratis', 'z. B. Un chupito gratis')}">
      <input data-p="texto_de" value="${esc(p.texto_de || '')}" placeholder="🇩🇪 z. B. Ein Gratis-Shot">
      <label class="check"><input type="checkbox" data-p="activo" ${p.activo !== false ? 'checked' : ''}> ${L('Activo', 'Aktiv')}</label>
      <button type="button" data-guardar-premio>💾</button><button type="button" data-borrar-premio>🗑️</button>
    </div>`;
  }
  const desdePeriodo = (periodo) => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    if (periodo === 'semana') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    if (periodo === 'mes') d.setDate(1);
    return d.toISOString();
  };
  let filasModeracion = [];
  let topGlobal = [];
  async function cargarModeracion() {
    const cont = $('[data-moderacion]'); if (!cont) return;
    try {
      const top = comprobar(await sb.rpc('ranking_global', { p_periodo: moderar.periodo, p_limite: 15 })) || [];
      topGlobal = top;
      $('[data-top-global]').innerHTML = top.length ? `<table class="tabla-admin"><thead><tr><th>#</th><th>Instagram</th><th>${L('Puntos', 'Punkte')}</th><th>${L('Juegos', 'Spiele')}</th><th>${L('Partidas', 'Runden')}</th></tr></thead><tbody>
        ${top.map((f) => `<tr><td>${f.posicion}</td><td><a href="https://www.instagram.com/${esc(f.instagram)}/" target="_blank" rel="noopener">@${esc(f.instagram)}</a></td><td><b>${f.puntos}</b></td><td>${f.juegos}</td><td>${f.partidas}</td></tr>`).join('')}
        </tbody></table>` : `<p class="vacio">${L('Nadie ha puntuado todavía en este periodo.', 'In diesem Zeitraum hat noch niemand gepunktet.')}</p>`;
      let q = sb.from('puntuaciones').select('*').gte('creado', desdePeriodo(moderar.periodo));
      if (moderar.juego) q = q.eq('juego', moderar.juego);
      filasModeracion = comprobar(await q.order('puntos', { ascending: false }).limit(100));
      const nombreJuego = (id) => CE.catalogo.find((j) => j.id === id)?.icono || id;
      cont.innerHTML = filasModeracion.length ? `<table class="tabla-admin"><thead><tr><th>${L('Juego', 'Spiel')}</th><th>Instagram</th><th>${L('Puntos', 'Punkte')}</th><th>${L('Fecha', 'Datum')}</th><th></th></tr></thead><tbody>
        ${filasModeracion.map((f) => `<tr class="${f.oculto ? 'oculto' : ''}"><td title="${esc(f.juego)}">${nombreJuego(f.juego)}</td>
          <td><a href="https://www.instagram.com/${esc(f.instagram)}/" target="_blank" rel="noopener">@${esc(f.instagram)}</a></td>
          <td><b>${f.puntos}</b></td><td>${new Date(f.creado).toLocaleString(CE.idioma === 'de' ? 'de-DE' : 'es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
          <td><button type="button" data-ocultar="${f.id}" title="${L('Ocultar/mostrar', 'Aus-/einblenden')}">${f.oculto ? '🚫' : '👁️'}</button><button type="button" data-borrar-punt="${f.id}">🗑️</button></td></tr>`).join('')}
        </tbody></table>` : `<p class="vacio">${L('Sin puntuaciones en este periodo.', 'Keine Punkte in diesem Zeitraum.')}</p>`;
    } catch (e) { fallo(e); }
  }
  raiz.addEventListener('change', (e) => {
    if (pestana !== 'juegos') return;
    if (e.target.matches('[data-qr-url]')) $('[data-qr-vista]').innerHTML = svgQr(e.target.value.trim());
    if (e.target.matches('[data-mod-juego]')) { moderar.juego = e.target.value; cargarModeracion(); }
    if (e.target.matches('[data-mod-periodo]')) { moderar.periodo = e.target.value; cargarModeracion(); }
    if (e.target.matches('[name=ranking_modo]')) {
      const modo = e.target.value;
      (async () => {
        comprobar(await sb.from('ajustes').update({ ranking_modo: modo }).eq('id', 1));
        estado.ajustes.ranking_modo = modo; aviso(`✅ ${L('Guardado', 'Gespeichert')}`); cargarModeracion();
      })().catch(fallo);
    }
  });
  raiz.addEventListener('submit', async (e) => {
    if (pestana !== 'juegos' || !e.target.matches('[data-form-codigo], [data-form-promo]')) return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    try {
      if (e.target.matches('[data-form-codigo]')) {
        comprobar(await sb.from('secretos').upsert({ id: 1, codigo_juego: (d.codigo || '').trim().toUpperCase() || null }));
        comprobar(await sb.from('ajustes').update({ ranking_con_codigo: !!d.ranking_con_codigo }).eq('id', 1));
      } else if (e.target.matches('[data-form-promo]')) {
        comprobar(await sb.from('ajustes').update({ promo_ruleta_es: d.promo_ruleta_es.trim() || null, promo_ruleta_de: d.promo_ruleta_de.trim() || null }).eq('id', 1));
      }
      aviso(`✅ ${L('Guardado', 'Gespeichert')}`); await recargar();
    } catch (err) { fallo(err); }
  });
  raiz.addEventListener('click', async (e) => {
    if (pestana !== 'juegos') return;
    const b = e.target.closest('button'); if (!b) return;
    try {
      if ('imprimirQr' in b.dataset) { imprimirCarteles($('[data-qr-url]').value.trim()); return; }
      if ('descargarQr' in b.dataset) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([svgQr($('[data-qr-url]').value.trim())], { type: 'image/svg+xml' }));
        a.download = 'qr-juegos.svg'; a.click(); return;
      }
      if ('generar' in b.dataset) {
        const palabras = ['TACO', 'SALSA', 'LIMA', 'CHILE', 'MOLE', 'AGAVE', 'NOPAL', 'ELOTE', 'SALUD', 'FIESTA'];
        $('[name=codigo]').value = `${CE.azar ? CE.azar(palabras) : palabras[Math.floor(Math.random() * palabras.length)]}${Math.floor(10 + Math.random() * 90)}`;
      } else if ('nuevoPremio' in b.dataset) {
        $('.premios-admin').insertAdjacentHTML('beforeend', filaPremio({ periodo: 'semana', activo: true }));
      } else if ('guardarPremio' in b.dataset || 'borrarPremio' in b.dataset) {
        const r = b.closest('.premio'); const id = r.dataset.id;
        if ('borrarPremio' in b.dataset) {
          if (id) comprobar(await sb.from('premios').delete().eq('id', id));
          r.remove(); aviso(`🗑️ ${L('Borrado', 'Gelöscht')}`); return;
        }
        const val = (n) => $(`[data-p=${n}]`, r);
        const fila = { periodo: val('periodo').value, juego: null, texto_es: val('texto_es').value.trim(), texto_de: val('texto_de').value.trim() || null, activo: val('activo').checked };
        if (!fila.texto_es) { aviso(L('Escribe el premio en español.', 'Bitte den Preis auf Spanisch eintragen.'), true); return; }
        if (id) comprobar(await sb.from('premios').update(fila).eq('id', id));
        else comprobar(await sb.from('premios').insert({ ...fila, orden: estado.premios.length }));
        aviso(`✅ ${L('Guardado', 'Gespeichert')}`); await recargar();
      } else if (b.dataset.ocultar) {
        const f = filasModeracion.find((x) => String(x.id) === b.dataset.ocultar);
        comprobar(await sb.from('puntuaciones').update({ oculto: !f.oculto }).eq('id', f.id)); cargarModeracion();
      } else if (b.dataset.borrarPunt) {
        if (!confirm(L('¿Borrar esta puntuación?', 'Diesen Eintrag löschen?'))) return;
        comprobar(await sb.from('puntuaciones').delete().eq('id', b.dataset.borrarPunt)); cargarModeracion();
      } else if ('copiar' in b.dataset) {
        const texto = topGlobal.slice(0, 3).map((f, i) => `${['🥇', '🥈', '🥉'][i]} @${f.instagram} – ${f.puntos}`).join('\n');
        await navigator.clipboard.writeText(texto);
        aviso(`📋 ${L('Copiado', 'Kopiert')}`);
      }
    } catch (err) { fallo(err); }
  });

  CE.aplicarIdioma();
  iniciar();
})();
