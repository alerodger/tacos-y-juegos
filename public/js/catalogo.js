// Lista de juegos del salón. "listo: true" = ya se puede jugar.
// min = jugadores mínimos en la mesa (1 = se puede jugar solo); color = fondo de la tarjeta.
window.CE = window.CE || {};

CE.categoriasJuego = [
  { id: 'arcade', icono: '🕹️' },
  { id: 'grupo', icono: '👯' },
  { id: 'beber', icono: '🥃' },
  { id: 'aprender', icono: '📚' },
];

CE.catalogo = [
  // --- Arcade con ranking (se juega solo) ---
  { id: 'pinata', cat: 'arcade', icono: '🪅', ranking: true, listo: true, min: 1, color: '#e93d8f',
    nombre_es: 'Piñata Smash', nombre_de: 'Piñata Smash',
    desc_es: 'Revienta la piñata del jefe a golpes. ¡Encadena combos!', desc_de: 'Hau die Chef-Piñata kaputt. Kombos bringen mehr!' },
  { id: 'lluvia', cat: 'arcade', icono: '🌮', ranking: true, listo: true, min: 1, color: '#2cc4d6',
    nombre_es: 'Lluvia de Tacos', nombre_de: 'Taco-Regen',
    desc_es: 'El jefe atrapa tacos al vuelo… y esquiva los chiles.', desc_de: 'Der Chef fängt Tacos… und weicht den Chilis aus.' },
  { id: 'ahorcado', cat: 'arcade', icono: '🔤', ranking: true, listo: true, min: 1, color: '#f2a541',
    nombre_es: '¡Salva al Jefe!', nombre_de: 'Rette den Chef!',
    desc_es: 'Adivina la palabra en el otro idioma antes de que cuelguen al jefe.', desc_de: 'Errate das Wort in der anderen Sprache, bevor der Chef hängt.' },
  { id: 'quiz', cat: 'arcade', icono: '🌵', ranking: true, listo: true, min: 1, color: '#2e9e5b',
    nombre_es: 'Más Mexicano que el Nopal', nombre_de: 'Mexikanischer als ein Kaktus',
    desc_es: '10 preguntas, 15 segundos. ¿Cuánto sabes de México?', desc_de: '10 Fragen, 15 Sekunden. Wie gut kennst du Mexiko?' },
  { id: 'memoria', cat: 'arcade', icono: '🃏', ranking: true, listo: true, min: 1, color: '#a259ff',
    nombre_es: 'Memo-Taco', nombre_de: 'Memo-Taco',
    desc_es: 'Empareja cada palabra en español con su traducción.', desc_de: 'Finde zu jedem spanischen Wort die Übersetzung.' },
  // --- Para la mesa ---
  { id: 'impostor', cat: 'grupo', icono: '🕵️', listo: true, min: 3, color: '#d42d3b',
    nombre_es: 'El Impostor', nombre_de: 'Der Impostor',
    desc_es: 'Todos tienen la palabra secreta… menos uno. ¡Descubridlo!', desc_de: 'Alle kennen das geheime Wort… bis auf einen. Entlarvt ihn!' },
  { id: 'adivina', cat: 'grupo', icono: '🤳', listo: true, min: 4, color: '#2cc4d6',
    nombre_es: '¿Qué Soy?', nombre_de: 'Was bin ich?',
    desc_es: 'Móvil en la frente y tu equipo te da pistas. ¡60 segundos!', desc_de: 'Handy an die Stirn, dein Team erklärt. 60 Sekunden!' },
  { id: 'loteria', cat: 'grupo', icono: '🎴', listo: true, min: 2, color: '#f2a541',
    nombre_es: 'Lotería Cantinera', nombre_de: 'Lotería – Mexiko-Bingo',
    desc_es: 'El bingo mexicano: uno canta las cartas, los demás marcan.', desc_de: 'Das mexikanische Bingo: einer ruft, die anderen markieren.' },
  { id: 'dedo', cat: 'grupo', icono: '☝️', listo: true, min: 2, color: '#a259ff',
    nombre_es: 'El Dedo del Destino', nombre_de: 'Finger des Schicksals',
    desc_es: 'Todos un dedo en la pantalla… ¿a quién le toca pagar la ronda?', desc_de: 'Alle einen Finger aufs Handy… wer zahlt die nächste Runde?' },
  // --- Para brindar (+18) ---
  { id: 'pirinola', cat: 'beber', icono: '🌀', listo: true, min: 2, color: '#f2a541',
    nombre_es: '¡Toma Todo!', nombre_de: '¡Toma Todo!',
    desc_es: 'La pirinola de toda la vida: toma uno, pon dos, todos ponen…', desc_de: 'Der mexikanische Trinkkreisel: nimm einen, gib zwei, alle trinken…' },
  { id: 'ruleta', cat: 'beber', icono: '🎰', listo: true, min: 2, color: '#d42d3b',
    nombre_es: 'La Ruleta del Jefe', nombre_de: 'Das Glücksrad vom Chef',
    desc_es: 'Gira y que decida la suerte: chupito, reto o ronda.', desc_de: 'Dreh und lass das Glück entscheiden: Shot, Challenge oder Runde.' },
  { id: 'verdadreto', cat: 'beber', icono: '🔥', listo: true, min: 2, color: '#e93d8f',
    nombre_es: 'Verdad o Tequila', nombre_de: 'Wahrheit oder Tequila',
    desc_es: 'Contesta, cumple el reto… o bebe.', desc_de: 'Antworte, mach die Challenge… oder trink.' },
  { id: 'cubilete', cat: 'beber', icono: '🎲', listo: true, min: 2, color: '#2e9e5b',
    nombre_es: 'Cubilete Cantinero', nombre_de: 'Cantina-Würfelpoker',
    desc_es: 'El póker de dados de las cantinas. La peor mano invita.', desc_de: 'Würfelpoker wie in der Cantina. Die schlechteste Hand zahlt.' },
  { id: 'yonunca', cat: 'beber', icono: '🙊', listo: true, min: 3, color: '#a259ff',
    nombre_es: 'Yo Nunca Nunca', nombre_de: 'Ich hab noch nie…',
    desc_es: 'Si lo has hecho, bebes. Los secretos salen solos.', desc_de: 'Wer es schon gemacht hat, trinkt. Geheimnisse inklusive.' },
  { id: 'masprobable', cat: 'beber', icono: '👉', listo: true, min: 3, color: '#2cc4d6',
    nombre_es: '¿Quién de la Mesa?', nombre_de: 'Wer am Tisch…?',
    desc_es: 'A la de tres, todos señalan. El más señalado bebe.', desc_de: 'Auf drei zeigen alle. Wer am meisten Finger abbekommt, trinkt.' },
];

// Tope de puntos por partida (igual que max_puntos() en supabase/esquema.sql)
CE.maxPuntos = { ahorcado: 4000, memoria: 1200, quiz: 1250, pinata: 4000, lluvia: 6000 };
