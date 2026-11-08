// Lista de juegos de la sala. "listo: true" = ya se puede jugar.
window.CE = window.CE || {};

CE.categoriasJuego = [
  { id: 'beber', icono: '🥃' },
  { id: 'grupo', icono: '👯' },
  { id: 'aprender', icono: '📚' },
  { id: 'arcade', icono: '🕹️' },
];

CE.catalogo = [
  // --- Para brindar (+18) ---
  { id: 'pirinola', cat: 'beber', icono: '🌀', listo: true,
    nombre_es: 'Pirinola: ¡toma todo!', nombre_de: 'Pirinola: ¡toma todo!',
    desc_es: 'La peonza clásica de México: toma uno, pon dos, todos ponen… ¡o toma todo!', desc_de: 'Der mexikanische Kreisel: nimm einen, gib zwei, alle trinken… oder ¡toma todo!' },
  { id: 'ruleta', cat: 'beber', icono: '🎡', listo: true,
    nombre_es: 'La ruleta del jefe', nombre_de: 'Das Glücksrad vom Chef',
    desc_es: 'Gira y que decida la suerte: chupito, reto o ronda para la mesa.', desc_de: 'Dreh und lass das Glück entscheiden: Shot, Challenge oder eine Runde für den Tisch.' },
  { id: 'cubilete', cat: 'beber', icono: '🎲', listo: true,
    nombre_es: 'Cubilete', nombre_de: 'Cubilete (Würfelpoker)',
    desc_es: 'El póker de dados de las cantinas mexicanas. La peor mano invita.', desc_de: 'Das Würfelpoker der mexikanischen Cantinas. Die schlechteste Hand zahlt.' },
  { id: 'yonunca', cat: 'beber', icono: '🙊', listo: true,
    nombre_es: 'Yo nunca…', nombre_de: 'Ich hab noch nie…',
    desc_es: 'Frases para descubrir los secretos de la mesa.', desc_de: 'Sätze, die die Geheimnisse am Tisch verraten.' },
  { id: 'verdadreto', cat: 'beber', icono: '🔥', listo: true,
    nombre_es: 'Verdad o reto', nombre_de: 'Wahrheit oder Pflicht',
    desc_es: 'Retos con sabor mexicano: pedir en español, cantar, brindar…', desc_de: 'Challenges mit mexikanischem Flair: auf Spanisch bestellen, singen, anstoßen…' },
  { id: 'masprobable', cat: 'beber', icono: '👉', listo: true,
    nombre_es: '¿Quién es más probable…?', nombre_de: 'Wer würde am ehesten…?',
    desc_es: 'A la de tres, todos señalan. El más señalado bebe.', desc_de: 'Auf drei zeigen alle. Wer die meisten Finger abbekommt, trinkt.' },
  // --- En grupo ---
  { id: 'dedo', cat: 'grupo', icono: '☝️', listo: true,
    nombre_es: 'El dedo del destino', nombre_de: 'Der Finger des Schicksals',
    desc_es: 'Todos ponen un dedo en el móvil… ¿a quién le toca pagar la ronda?', desc_de: 'Alle legen einen Finger aufs Handy… wer zahlt die nächste Runde?' },
  { id: 'loteria', cat: 'grupo', icono: '🎴', listo: true,
    nombre_es: 'Lotería', nombre_de: 'Lotería',
    desc_es: 'El bingo mexicano: un móvil canta las cartas, cada uno marca su tablero.', desc_de: 'Das mexikanische Bingo: Ein Handy ruft die Karten, jeder markiert sein Brett.' },
  { id: 'adivina', cat: 'grupo', icono: '🤳', listo: true,
    nombre_es: 'Adivina la palabra', nombre_de: 'Wörter raten',
    desc_es: 'Móvil en la frente: tu equipo te da pistas. ¡60 segundos!', desc_de: 'Handy an die Stirn: Dein Team erklärt. 60 Sekunden!' },
  // --- Aprender ---
  { id: 'ahorcado', cat: 'aprender', icono: '🔤', ranking: true, listo: true,
    nombre_es: 'Ahorcado bilingüe', nombre_de: 'Galgenmännchen zweisprachig',
    desc_es: 'Adivina palabras en alemán (o en español) letra a letra antes de que cuelguen al jefe.', desc_de: 'Errate spanische (oder deutsche) Wörter Buchstabe für Buchstabe, bevor der Chef hängt.' },
  { id: 'memoria', cat: 'aprender', icono: '🃏', ranking: true, listo: true,
    nombre_es: 'Memoria ES ↔ DE', nombre_de: 'Memory ES ↔ DE',
    desc_es: 'Empareja cada palabra con su traducción.', desc_de: 'Finde zu jedem Wort die Übersetzung.' },
  { id: 'quiz', cat: 'aprender', icono: '❓', ranking: true, listo: true,
    nombre_es: '¿Cuánto sabes de México?', nombre_de: 'Wie gut kennst du Mexiko?',
    desc_es: 'Preguntas rápidas de comida, cultura y frases.', desc_de: 'Schnelle Fragen zu Essen, Kultur und Redewendungen.' },
  // --- Arcade con ranking ---
  { id: 'pinata', cat: 'arcade', icono: '🪅', ranking: true, listo: true,
    nombre_es: 'La piñata del jefe', nombre_de: 'Die Chef-Piñata',
    desc_es: 'Dale a la piñata con la cara del jefe y atrapa los caramelos.', desc_de: 'Hau auf die Piñata mit dem Gesicht vom Chef und fang die Bonbons.' },
  { id: 'lluvia', cat: 'arcade', icono: '🌮', ranking: true, listo: true,
    nombre_es: 'Lluvia de tacos', nombre_de: 'Taco-Regen',
    desc_es: 'Atrapa los tacos que caen del cielo y esquiva los chiles.', desc_de: 'Fang die Tacos, die vom Himmel fallen, und weich den Chilis aus.' },
];
