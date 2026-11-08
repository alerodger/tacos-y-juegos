// Datos de ejemplo mientras no hay Supabase configurado.
// Dirección, teléfono y horario sacados de directorios públicos: CONFIRMAR con el restaurante.
// Carta INVENTADA como ejemplo: sustituir por la real.
window.CE = window.CE || {};

CE.demo = {
  ajustes: {
    nombre: 'Cantina Ensenada',
    direccion: 'Löwengrube 4',
    cp_ciudad: '94032 Passau',
    telefono: '+49 851 931146',
    instagram: 'cantinaensenada_passau',
    reserva_url: 'https://www.thefork.de/restaurant/cantina-ensenada-r850664',
    maps_url: 'https://www.google.com/maps/search/?api=1&query=L%C3%B6wengrube+4+94032+Passau',
    horario: [
      { dias_es: 'Lunes a domingo', dias_de: 'Montag bis Sonntag', horas: '18:00 – 01:00' },
    ],
    cara_jefe: null, // URL de la foto del dueño (recortada en círculo). null = jefe dibujado
  },

  categorias: [
    { id: 'tacos', nombre_es: 'Tacos', nombre_de: 'Tacos', icono: '🌮' },
    { id: 'antojitos', nombre_es: 'Para compartir', nombre_de: 'Zum Teilen', icono: '🥑' },
    { id: 'platos', nombre_es: 'Platos fuertes', nombre_de: 'Hauptgerichte', icono: '🍲' },
    { id: 'postres', nombre_es: 'Postres', nombre_de: 'Desserts', icono: '🍮' },
    { id: 'cocteles', nombre_es: 'Cócteles', nombre_de: 'Cocktails', icono: '🍹' },
    { id: 'cervezas', nombre_es: 'Cervezas y más', nombre_de: 'Bier & mehr', icono: '🍺' },
  ],

  platos: [
    { cat: 'tacos', nombre_es: 'Tacos al pastor', nombre_de: 'Tacos al Pastor', desc_es: 'Cerdo adobado, piña asada, cebolla y cilantro.', desc_de: 'Marinierter Schweinebraten, gegrillte Ananas, Zwiebeln und Koriander.', precio: 11.9, picante: 1 },
    { cat: 'tacos', nombre_es: 'Tacos de pescado estilo Ensenada', nombre_de: 'Fisch-Tacos Ensenada-Style', desc_es: 'Pescado rebozado, col morada, crema de chipotle y lima.', desc_de: 'Fisch im Bierteig, Rotkohl, Chipotle-Creme und Limette.', precio: 13.5, picante: 1, destacado: true },
    { cat: 'tacos', nombre_es: 'Tacos de cochinita pibil', nombre_de: 'Tacos Cochinita Pibil', desc_es: 'Cerdo cocinado lento en achiote con cebolla morada encurtida.', desc_de: 'Langsam gegartes Schwein in Achiote mit eingelegten roten Zwiebeln.', precio: 12.5, picante: 1 },
    { cat: 'tacos', nombre_es: 'Tacos de setas y nopal', nombre_de: 'Tacos mit Pilzen & Nopal', desc_es: 'Setas salteadas, nopal, queso fresco y salsa verde.', desc_de: 'Gebratene Pilze, Kaktus, Frischkäse und grüne Salsa.', precio: 11.5, veg: true },
    { cat: 'antojitos', nombre_es: 'Guacamole con totopos', nombre_de: 'Guacamole mit Tortilla-Chips', desc_es: 'Aguacate machacado al momento con lima, tomate y cilantro.', desc_de: 'Frisch zerdrückte Avocado mit Limette, Tomate und Koriander.', precio: 8.5, vegano: true },
    { cat: 'antojitos', nombre_es: 'Nachos de la cantina', nombre_de: 'Cantina-Nachos', desc_es: 'Totopos, frijoles, queso fundido, jalapeños, pico de gallo y crema.', desc_de: 'Tortilla-Chips, Bohnen, geschmolzener Käse, Jalapeños, Pico de Gallo und Sauerrahm.', precio: 10.9, picante: 2, veg: true },
    { cat: 'antojitos', nombre_es: 'Elote asado', nombre_de: 'Gegrillter Maiskolben', desc_es: 'Maíz a la parrilla con mayonesa, queso cotija y chile en polvo.', desc_de: 'Gegrillter Mais mit Mayonnaise, Cotija-Käse und Chilipulver.', precio: 6.5, picante: 1, veg: true },
    { cat: 'antojitos', nombre_es: 'Quesadillas', nombre_de: 'Quesadillas', desc_es: 'Tortilla de harina con queso fundido. Con pollo +2 €.', desc_de: 'Weizentortilla mit geschmolzenem Käse. Mit Hähnchen +2 €.', precio: 9.5, veg: true },
    { cat: 'platos', nombre_es: 'Burrito grande', nombre_de: 'Großer Burrito', desc_es: 'Arroz, frijoles, queso, guacamole y tu carne favorita.', desc_de: 'Reis, Bohnen, Käse, Guacamole und dein Lieblingsfleisch.', precio: 15.9 },
    { cat: 'platos', nombre_es: 'Enchiladas verdes', nombre_de: 'Grüne Enchiladas', desc_es: 'Tortillas rellenas de pollo bañadas en salsa de tomatillo.', desc_de: 'Gefüllte Tortillas mit Hähnchen in Tomatillo-Salsa.', precio: 16.5, picante: 1 },
    { cat: 'platos', nombre_es: 'Fajitas para dos', nombre_de: 'Fajitas für zwei', desc_es: 'Ternera y pollo en sartén caliente con pimientos, tortillas y salsas.', desc_de: 'Rind und Hähnchen in heißer Pfanne mit Paprika, Tortillas und Salsas.', precio: 36, destacado: true },
    { cat: 'platos', nombre_es: 'Chili sin carne', nombre_de: 'Chili sin Carne', desc_es: 'Frijoles, maíz y verduras con especias mexicanas y arroz.', desc_de: 'Bohnen, Mais und Gemüse mit mexikanischen Gewürzen und Reis.', precio: 14.5, picante: 2, vegano: true },
    { cat: 'postres', nombre_es: 'Churros con chocolate', nombre_de: 'Churros mit Schokolade', desc_es: 'Recién hechos, con azúcar y canela.', desc_de: 'Frisch gemacht, mit Zucker und Zimt.', precio: 6.9, veg: true },
    { cat: 'postres', nombre_es: 'Flan de cajeta', nombre_de: 'Karamell-Flan', desc_es: 'El flan de la abuela con dulce de leche de cabra.', desc_de: 'Omas Flan mit Ziegenmilch-Karamell.', precio: 6.5, veg: true },
    { cat: 'cocteles', nombre_es: 'Margarita clásica', nombre_de: 'Margarita Classic', desc_es: 'Tequila, triple seco y lima con borde de sal.', desc_de: 'Tequila, Triple Sec und Limette mit Salzrand.', precio: 9.5, destacado: true },
    { cat: 'cocteles', nombre_es: 'Margarita de mango y chile', nombre_de: 'Mango-Chili-Margarita', desc_es: 'Mango, tequila, lima y borde de Tajín.', desc_de: 'Mango, Tequila, Limette und Tajín-Rand.', precio: 10.5, picante: 1 },
    { cat: 'cocteles', nombre_es: 'Paloma', nombre_de: 'Paloma', desc_es: 'Tequila, pomelo, lima y soda.', desc_de: 'Tequila, Grapefruit, Limette und Soda.', precio: 9.5 },
    { cat: 'cocteles', nombre_es: 'Michelada', nombre_de: 'Michelada', desc_es: 'Cerveza con lima, salsas y borde de chile.', desc_de: 'Bier mit Limette, Würzsaucen und Chilirand.', precio: 7.5, picante: 1 },
    { cat: 'cocteles', nombre_es: 'Agua fresca de jamaica', nombre_de: 'Hibiskus-Agua-Fresca', desc_es: 'Sin alcohol. Flor de hibisco, lima y un toque de azúcar.', desc_de: 'Alkoholfrei. Hibiskusblüte, Limette und etwas Zucker.', precio: 4.9, vegano: true },
    { cat: 'cervezas', nombre_es: 'Corona / Sol / Modelo', nombre_de: 'Corona / Sol / Modelo', desc_es: 'Botella 0,33 l, con su lima.', desc_de: 'Flasche 0,33 l, mit Limette.', precio: 4.9 },
    { cat: 'cervezas', nombre_es: 'Chupito de tequila o mezcal', nombre_de: 'Tequila- oder Mezcal-Shot', desc_es: 'Con naranja y sal de gusano… si te atreves.', desc_de: 'Mit Orange und Wurmsalz… wenn du dich traust.', precio: 4.5 },
  ],

  // Fotos de ejemplo (sin imagen real: se dibujan con color y emoji)
  fotos: [
    { emoji: '🌮', texto_es: 'Tacos recién hechos', texto_de: 'Frische Tacos', color: '#e8407c' },
    { emoji: '🍹', texto_es: 'Margaritas de la casa', texto_de: 'Hausgemachte Margaritas', color: '#f6a21e' },
    { emoji: '🎶', texto_es: 'Noches con música', texto_de: 'Abende mit Musik', color: '#0e7c86' },
    { emoji: '🌶️', texto_es: 'Salsas caseras', texto_de: 'Hausgemachte Salsas', color: '#d7263d' },
    { emoji: '💀', texto_es: 'Decoración mexicana', texto_de: 'Mexikanisches Flair', color: '#6b3fa0' },
    { emoji: '🥑', texto_es: 'Guacamole al momento', texto_de: 'Frische Guacamole', color: '#2e9e5b' },
  ],
};
