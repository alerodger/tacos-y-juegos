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

## Ronda 2 (cambios del socio, 09/11/2026)

- [x] **A. Ranking global**: suma de puntos de todos los juegos con 🏆 por Instagram (día / semana /
      mes), top 15, posición propia aunque no se esté en el top, escalas de puntos igualadas
      (~1.000–1.500 por buena partida), tope por juego, modo "mejor partida de cada juego" o
      "todas las partidas" (elige el dueño), modo DEMO sin Supabase
- [x] **B. Salón de juegos**: jugadores y casilla de juegos de beber antes de elegir (los juegos
      que no encajan bajan y se ponen grises), tarjetas con vista previa tipo CrazyGames, nombres
      más atractivos, top 3 en una tele antigua con interferencias, juego del Impostor
- [x] **C. Portada**: botones fijos (carta, juegos, Instagram), botón de jugar que tiembla, notas de
      Google / Lieferando / TripAdvisor / TheFork, top 3 en la tele, Hall of Fame (reseñas reales +
      fotos), pixel art de una pareja bailando en el tequila bar
- [~] **D. Carta con fotos**: [x] fotos ampliables con visor y etiqueta "Foto ilustrativa /
      Symbolbild", [x] botón 📷 en el panel para hacer la foto con el móvil, [x] 95 prompts en
      `docs/prompts-fotos.md` + importador (`npm run fotos`); [ ] generar las imágenes (el servicio
      gratuito de IA probado no da calidad suficiente: hacerlas con ChatGPT/Gemini)
- [x] **E. Panel en modo demostración** (sin Supabase; los cambios se ven en la web de ese
      navegador) + gestión de reseñas (Hall of Fame) y notas de otras webs

## Pendiente de conseguir del cliente

- Logo en vectorial / alta resolución (ahora solo hay uno de 150 px)
- Confirmar la carta y las traducciones al español; Mole negro (dip) puesto a 4,00 € leyendo una
  foto borrosa (TheFork decía 40 €)
- Permiso de uso de las fotos (ahora hay 5 sacadas de internet/Instagram)
- Nota exacta de Google (ReviewHero da 4,44 con 601 opiniones, pero mezcla Google y Facebook) y
  si están en Tripadvisor / Lieferando (no se ha encontrado ficha)
- Foto de la cara del dueño (con su consentimiento por escrito)
- Datos para el Impressum (titular, contacto, USt-IdNr.)
