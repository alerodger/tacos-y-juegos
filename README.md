# Tacos y juegos

Web de un restaurante mexicano: carta, galería, ubicación, panel de administración y una sala de
juegos para los clientes con rankings y premios. Español 🇲🇽 y alemán 🇩🇪.

Web estática (HTML, CSS y JavaScript sin compilación) + [Supabase](https://supabase.com) para la
base de datos, el inicio de sesión del administrador y las fotos. Todo lo que se publica está en
`public/`. Las rutas son relativas para que funcione igual en GitHub Pages (`/tacos-y-juegos/`) y en
el dominio final. Mientras no se configure Supabase, la web usa los datos de `public/js/demo.js`.

## Páginas

| Ruta | Qué es |
|---|---|
| `/` | Portada: favoritos, carta (comer/beber), tequila bar, galería y contacto |
| `/juegos/` | Sala de juegos (la URL del QR de las mesas) |
| `/juegos/?j=<juego>` | Un juego concreto |
| `/juegos/?ranking` | Rankings diarios, semanales y mensuales con premios |
| `/admin/` | Panel de administración |
| `/legal/` | Impressum, Datenschutz y Teilnahmebedingungen (plantillas por completar) |

## Conectar Supabase (unos 10 minutos)

1. Crear un proyecto en supabase.com con la cuenta del restaurante, **región Frankfurt (eu-central-1)**.
2. **SQL Editor** → pegar y ejecutar `supabase/esquema.sql`, y después `supabase/semilla.sql`
   (carga la carta, la galería, los ajustes y dos premios de ejemplo).
3. **Project Settings → API**: copiar la *Project URL* y la clave *anon / publishable* en
   `public/js/config.js`. La clave `service_role` **no** se pone nunca en la web.
4. **Authentication → Users → Add user**: crear el usuario del dueño (email + contraseña, marcar
   *Auto Confirm User*). Después, en el SQL Editor, hacerlo administrador:
   ```sql
   insert into admins (user_id, email) select id, email from auth.users where email = 'dueño@ejemplo.de';
   ```
5. **Authentication → URL Configuration**: en *Site URL* poner la dirección de la web y en
   *Redirect URLs* añadir `https://<web>/admin/` (para "he olvidado la contraseña").
6. Entrar en `/admin/` con ese usuario.
7. Opcional: para que Supabase gratis no se pause tras 7 días sin visitas, programar en
   cron-job.org una visita diaria a `https://<proyecto>.supabase.co/rest/v1/ajustes?select=id`
   con la cabecera `apikey: <clave anon>`.

Las fotos de la semilla apuntan a `public/assets/fotos/`. Las que se suban desde el panel van al
bucket `fotos` de Supabase (se reducen a WebP en el navegador antes de subirlas).

## Panel de administración

- **Carta**: platos por categoría (añadir, editar, ocultar, ordenar, borrar), variantes con precio
  propio, foto, etiquetas (picante, vegetariano, vegano, favorito) y gestión de categorías.
- **Fotos**: galería de la portada (subir, pies de foto ES/DE, ordenar, foto grande).
- **Reseñas**: el Hall of Fame de la portada (solo reseñas reales, nombre de pila + inicial).
- **Datos y horario**: dirección, teléfono, enlaces, notas en Google / TheFork / Tripadvisor /
  Lieferando y horario por días.
- **Cara del jefe**: la foto que sale en los juegos (se recorta en cuadrado).
- **Juegos y ranking**: código del día, QR de las mesas (carteles imprimibles 4 por A4), casilla de
  premio de la ruleta, premios por periodo y moderación del ranking (ocultar/borrar, copiar los
  ganadores para Instagram).

### Modo demostración

Mientras `config.js` no tenga las claves de Supabase (o con `/admin/?demo`), el panel funciona en
**modo demostración**: entra sin contraseña, guarda los cambios en el navegador (localStorage) y la
web pública de ese mismo navegador los muestra al momento. Sirve para enseñar el panel al cliente.
El botón "Restablecer demo" vuelve a los datos de ejemplo.

## Seguridad

- Todo se protege con políticas RLS en `supabase/esquema.sql`: cualquiera lee la carta, solo los
  usuarios de la tabla `admins` escriben.
- Las puntuaciones solo se guardan mediante la función `guardar_puntuacion`, que comprueba el código
  del día (guardado en la tabla `secretos`, que solo lee el admin), el consentimiento y un límite de
  un envío cada 20 s. Las puntuaciones se calculan en el navegador: alguien con conocimientos podría
  falsearlas; por eso el código del día y la moderación.
- Las puntuaciones de más de 6 meses se borran con `limpiar_puntuaciones()` (programable con pg_cron).

## Estructura

```
public/js/config.js        Claves públicas de Supabase
public/js/i18n.js          Textos ES/DE y cambio de idioma
public/js/demo.js          Carta y ajustes (datos de ejemplo y origen de la semilla)
public/js/datos.js         Carga de datos y API REST de Supabase
public/js/web.js           Portada
public/js/sala.js          Sala de juegos
public/js/motor.js         Cara del jefe, récords y pantalla de fin de partida
public/js/ranking.js       Ranking general (Supabase o modo demo) y formulario de puntuación
public/js/tele.js          Tele antigua con el top 3
public/js/admin.js         Panel de administración
public/js/juegos/*.js      Un archivo por juego
public/vendor/supabase.js  supabase-js 2.45.4 (alojado aquí, sin CDN)
public/vendor/qrcode.js    qrcode-generator 1.4.4 (MIT)
supabase/esquema.sql       Tablas, permisos, funciones y almacenamiento
supabase/semilla.sql       GENERADO con `node scripts/generar-semilla.mjs`
```

## Portadas de los juegos

Las imágenes de `public/assets/juegos/` se generan jugando unos segundos a cada juego y montando la
captura en un móvil. Si se cambia un juego, se regeneran así (con el servidor local en marcha):

```
npm install          # solo la primera vez (herramientas de desarrollo)
npm run portadas     # o: node scripts/portadas.mjs http://localhost:8766/ impostor ruleta
```

## Fotos de la carta

- `npm run prompts` genera `docs/prompts-fotos.md`: un prompt por plato o cóctel sin foto, con el
  mismo estilo, para crear las imágenes con ChatGPT o Gemini.
- Se guardan con el nombre de archivo indicado en una carpeta y `npm run fotos -- <carpeta>` las
  recorta, las pasa a WebP en `public/assets/platos/` y las asigna (`public/js/fotos-platos.js`).
  Después, `npm run semilla` para llevarlas también a Supabase. Con `--reales` no se marcan como IA.
- En la web, las fotos de IA llevan la etiqueta "Foto ilustrativa / Symbolbild". Desde el panel, el
  botón 📷 de cada plato abre la cámara del móvil y sustituye la foto (y quita la etiqueta).

## Probar en local

```
python3 -m http.server 8765 -d public
```

y abrir http://localhost:8765

## Despliegue

Cada push a `main` publica `public/` en GitHub Pages (`.github/workflows/pages.yml`).
Plan completo en [PLAN.md](PLAN.md).
