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
- [x] **2. Juegos (1ª tanda)**: sala de juegos + Ahorcado ES↔DE con la cara del jefe
- [x] **1b. Identidad real**: logo, paleta del local, fotos propias y carta completa de TheFork
- [x] **3. Supabase (preparado, falta crear el proyecto)**: esquema con RLS, bucket de fotos,
      funciones de ranking y semilla generada desde `demo.js`. Probado con PGlite
- [x] **4. Panel de administración** (`/admin/`): carta, categorías, fotos, datos y horario, cara
      del jefe, código del día, premios, premio de la ruleta y moderación del ranking
- [x] **5. Rankings** diarios / semanales / mensuales con Instagram opcional, código del día y
      consentimiento explícito
- [x] **6. Más juegos** (14 en total)
  - [x] 18+ (con aviso, confirmación de edad y "vale sin alcohol"): *Pirinola toma todo*,
        *Ruleta del jefe*, *Cubilete* (póker de dados), *Yo nunca*, *Verdad o reto*,
        *¿Quién es más probable…?*
  - [x] En grupo: *El dedo del destino* (¿quién paga la ronda?), *Lotería* (cartas propias ES/DE),
        *Adivina la palabra*
  - [x] Arcade con la cara del jefe y ranking: *Piñata*, *Lluvia de tacos*
  - [x] Aprender con ranking: *Memoria ES↔DE*, *Quiz de México*
- [ ] **7. Ventas**: [x] enlaces a la carta de bebidas desde los juegos, [x] casilla de premio en
      la ruleta, [x] premios por ranking; [x] QR imprimible de mesa (carteles 4×A4 desde el panel); [ ] "happy hour del juego"
- [~] **8. Legal (obligatorio en Alemania)**: plantillas de Impressum, Datenschutzerklärung y
      Teilnahmebedingungen hechas; faltan los datos del titular y revisión. Sin cookies ni recursos
      de terceros (tipografías y supabase-js alojados en la web)
- [ ] **9. Producción**: Cloudflare Pages + dominio de Hostinger (DNS), SMTP propio, cron para que
      Supabase gratis no se pause, entrega de cuentas al cliente

## Pendiente de conseguir del cliente

- Logo en vectorial / alta resolución (ahora solo hay uno de 150 px)
- Confirmar la carta y las traducciones al español; Mole negro (dip) puesto a 4,00 € leyendo una
  foto borrosa (TheFork decía 40 €)
- Permiso de uso de las fotos (ahora hay 5 sacadas de internet/Instagram)
- Foto de la cara del dueño (con su consentimiento por escrito)
- Datos para el Impressum (titular, contacto, USt-IdNr.)
