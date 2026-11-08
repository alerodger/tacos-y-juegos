# Plan de acción

Web propia de un restaurante mexicano en Passau (Alemania): carta, fotos, reservas, panel de
administración y juegos para los clientes (rankings con premios, aprender español, juegos de mesa
en grupo). Bilingüe español 🇲🇽 / alemán 🇩🇪.

Pruebas en GitHub Pages → producción en Cloudflare Pages con el dominio del cliente.
Base de datos, inicio de sesión y fotos en Supabase (cuenta nueva, que se entregará al cliente).

## Fases

- [x] **0. Repositorio** y despliegue automático a GitHub Pages
- [x] **1. Base de la web**: diseño con motivos mexicanos, idiomas ES/DE, portada, carta, galería,
      dónde estamos (con datos de ejemplo mientras no hay Supabase)
- [ ] **2. Juegos (1ª tanda)**: sala de juegos + Ahorcado ES↔DE con la cara del jefe
- [ ] **3. Supabase**: esquema (ajustes, carta, fotos, puntuaciones, premios), permisos RLS,
      bucket de fotos
- [ ] **4. Panel de administración** (`/admin/`): carta, fotos, textos, horario, cara del jefe,
      código del día, premios, moderar rankings
- [ ] **5. Rankings** diarios / semanales / mensuales con Instagram, solo con el código del día
      (así solo puntúa quien está en el local) y consentimiento explícito
- [ ] **6. Más juegos**
  - Arcade con la cara del jefe: *Piñata* (golpear), *Lluvia de tacos* (atrapar)
  - Aprender: *Memoria ES↔DE*, *Quiz de México*
  - En grupo: *Lotería* (bingo mexicano, cartas propias), *Adivina la palabra* (móvil en la frente)
  - 18+ (con aviso y versión sin alcohol): *Yo nunca*, *Verdad o reto*, *Ruleta del jefe*
- [ ] **7. Ventas**: premios que se canjean en la barra (chupito, 2×1 tacos…), "happy hour del
      juego", enlaces a la carta de bebidas desde los juegos
- [ ] **8. Legal (obligatorio en Alemania)**: Impressum, Datenschutzerklärung, bases de los
      sorteos (Teilnahmebedingungen), sin cookies ni recursos de terceros sin consentimiento
- [ ] **9. Producción**: Cloudflare Pages + dominio de Hostinger (DNS), SMTP propio, cron para que
      Supabase gratis no se pause, entrega de cuentas al cliente

## Pendiente de conseguir del cliente

- Logo en buena calidad, colores de marca y tipografía (si tienen)
- Carta completa con precios (PDF o fotos); TheFork bloquea la descarga automática
- Fotos del local y de los platos (con permiso de uso)
- Foto de la cara del dueño (con su consentimiento por escrito)
- Datos para el Impressum (titular, dirección, contacto, USt-IdNr.)
- Confirmar horario y si reservan por TheFork, teléfono o ambos
