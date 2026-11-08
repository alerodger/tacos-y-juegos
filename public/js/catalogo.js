// Lista de juegos de la sala. "listo: true" = ya se puede jugar.
window.CE = window.CE || {};

CE.categoriasJuego = [
  { id: 'arcade', icono: '🕹️' },
  { id: 'aprender', icono: '📚' },
  { id: 'grupo', icono: '👯' },
  { id: 'beber', icono: '🥃' },
];

CE.catalogo = [
  { id: 'pinata', cat: 'arcade', icono: '🪅', ranking: true,
    nombre_es: 'La piñata del jefe', nombre_de: 'Die Chef-Piñata',
    desc_es: 'Dale a la piñata con la cara del jefe y atrapa los caramelos.', desc_de: 'Hau auf die Piñata mit dem Gesicht vom Chef und fang die Bonbons.' },
  { id: 'lluvia', cat: 'arcade', icono: '🌮', ranking: true,
    nombre_es: 'Lluvia de tacos', nombre_de: 'Taco-Regen',
    desc_es: 'Atrapa los tacos que caen del cielo y esquiva los chiles.', desc_de: 'Fang die Tacos, die vom Himmel fallen, und weich den Chilis aus.' },
  { id: 'ahorcado', cat: 'aprender', icono: '🔤', ranking: true, listo: true,
    nombre_es: 'Ahorcado bilingüe', nombre_de: 'Galgenmännchen zweisprachig',
    desc_es: 'Adivina palabras en alemán (o en español) letra a letra antes de que cuelguen al jefe.', desc_de: 'Errate spanische (oder deutsche) Wörter Buchstabe für Buchstabe, bevor der Chef hängt.' },
  { id: 'memoria', cat: 'aprender', icono: '🃏', ranking: true,
    nombre_es: 'Memoria ES ↔ DE', nombre_de: 'Memory ES ↔ DE',
    desc_es: 'Empareja cada palabra con su traducción.', desc_de: 'Finde zu jedem Wort die Übersetzung.' },
  { id: 'quiz', cat: 'aprender', icono: '❓', ranking: true,
    nombre_es: '¿Cuánto sabes de México?', nombre_de: 'Wie gut kennst du Mexiko?',
    desc_es: 'Preguntas rápidas de comida, cultura y frases.', desc_de: 'Schnelle Fragen zu Essen, Kultur und Redewendungen.' },
  { id: 'loteria', cat: 'grupo', icono: '🎴',
    nombre_es: 'Lotería', nombre_de: 'Lotería',
    desc_es: 'El bingo mexicano: un móvil canta las cartas, cada uno marca su tablero.', desc_de: 'Das mexikanische Bingo: Ein Handy ruft die Karten, jeder markiert sein Brett.' },
  { id: 'adivina', cat: 'grupo', icono: '🤳',
    nombre_es: 'Adivina la palabra', nombre_de: 'Wörter raten',
    desc_es: 'Móvil en la frente: tus amigos te dan pistas sin decir la palabra.', desc_de: 'Handy an die Stirn: Deine Freunde erklären, ohne das Wort zu sagen.' },
  { id: 'yonunca', cat: 'beber', icono: '🙊',
    nombre_es: 'Yo nunca…', nombre_de: 'Ich hab noch nie…',
    desc_es: 'Frases para descubrir los secretos de la mesa.', desc_de: 'Sätze, die die Geheimnisse am Tisch verraten.' },
  { id: 'verdadreto', cat: 'beber', icono: '🔥',
    nombre_es: 'Verdad o reto', nombre_de: 'Wahrheit oder Pflicht',
    desc_es: 'Retos con sabor mexicano para toda la mesa.', desc_de: 'Challenges mit mexikanischem Flair für den ganzen Tisch.' },
  { id: 'ruleta', cat: 'beber', icono: '🎡',
    nombre_es: 'La ruleta del jefe', nombre_de: 'Das Glücksrad vom Chef',
    desc_es: 'Gira y que decida la suerte: chupito, reto o ronda para la mesa.', desc_de: 'Dreh und lass das Glück entscheiden: Shot, Challenge oder eine Runde für den Tisch.' },
];
