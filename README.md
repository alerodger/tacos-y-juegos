# Tacos y juegos

Web de un restaurante mexicano: carta, galería, ubicación, panel de administración y una sala de
juegos para los clientes. Español 🇲🇽 y alemán 🇩🇪.

Web estática (HTML, CSS y JavaScript sin compilación) + [Supabase](https://supabase.com) para la
base de datos, el inicio de sesión del administrador y las fotos. Todo lo que se publica está en
`public/`. Todas las rutas son relativas para que funcione igual en GitHub Pages
(`/tacos-y-juegos/`) y en el dominio final.

## Páginas

| Ruta | Qué es |
|---|---|
| `/` | Portada: presentación, carta, galería, dónde estamos |
| `/juegos/` | Sala de juegos (la URL del QR de las mesas) |
| `/juegos/?j=ahorcado` | Un juego concreto |
| `/admin/` | Panel de administración *(fase 4)* |

## Estructura

```
public/js/config.js        Datos del restaurante y claves públicas de Supabase
public/js/i18n.js          Textos ES/DE y cambio de idioma
public/js/datos.js         Carga de datos (Supabase o datos de ejemplo)
public/js/demo.js          Carta y ajustes de ejemplo
public/js/web.js           Portada
public/js/sala.js          Sala de juegos
public/js/juegos/*.js      Un archivo por juego
public/css/                Estilos
```

## Probar en local

```
python3 -m http.server 8765 -d public
```

y abrir http://localhost:8765

## Despliegue

Cada push a `main` publica `public/` en GitHub Pages (`.github/workflows/pages.yml`).
Plan completo en [PLAN.md](PLAN.md).
