# Contexto del proyecto

Web **privada de un único restaurante** mexicano en Passau (Alemania). No es una plataforma ni
tiene relación con otros proyectos del usuario (p. ej. elreydelkebab.com): no mezclar código,
cuentas ni reglas.

El usuario habla español. Explicaciones claras y paso a paso.

- Repo: `alerodger/tacos-y-juegos` (público porque GitHub Pages gratis lo exige). **No usar el
  nombre del restaurante ni su dominio en el nombre del repo ni en URLs de prueba.**
- Pruebas: GitHub Pages. Producción (más adelante): Cloudflare Pages + dominio comprado en Hostinger.
- Supabase: cuenta nueva y dedicada que se entregará al cliente. Nunca usar los otros proyectos
  del usuario.
- Sin compilación; todo en `public/`, rutas **relativas** (la web vive en un subdirectorio en
  GitHub Pages).
- Bilingüe ES/DE: todo texto visible va en `public/js/i18n.js` o en campos `_es` / `_de`.
- Alemania: DSGVO estricta. Nada de Google Fonts por CDN en producción, mapas embebidos ni
  rastreadores sin consentimiento. Impressum y Datenschutz obligatorios.
- Commits según se completan tareas de `PLAN.md` (marcar las casillas).
- La carta vive en `public/js/demo.js`; `node scripts/generar-semilla.mjs` regenera
  `supabase/semilla.sql`. Cambios de BD en `supabase/esquema.sql` (idempotente).
- Pruebas sin Supabase real: el SQL se valida con PGlite (simulando `auth`/`storage`) y el panel con
  un supabase-js falso en memoria que sustituye `vendor/supabase.js` desde Playwright.
