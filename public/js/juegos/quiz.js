// ¿Cuánto sabes de México? 10 preguntas de comida, cultura y español; 15 segundos cada una.
// La respuesta correcta es siempre la primera de la lista (se barajan al mostrarlas).
CE.juegos.quiz = {
  iniciar(escenario) {
    const ac = new AbortController();
    const N = 10; const TIEMPO = 15;
    const P = (es, de) => ({ es, de });
    const PREGUNTAS = [
      P(['¿Cuál es la capital de México?', 'Ciudad de México', 'Guadalajara', 'Monterrey', 'Cancún'], ['Was ist die Hauptstadt Mexikos?', 'Mexiko-Stadt', 'Guadalajara', 'Monterrey', 'Cancún']),
      P(['¿De qué planta se hace el tequila?', 'Agave azul', 'Caña de azúcar', 'Maíz', 'Nopal'], ['Woraus wird Tequila hergestellt?', 'Blaue Agave', 'Zuckerrohr', 'Mais', 'Nopal-Kaktus']),
      P(['¿En qué estado está Ensenada?', 'Baja California', 'Yucatán', 'Oaxaca', 'Jalisco'], ['In welchem Bundesstaat liegt Ensenada?', 'Baja California', 'Yucatán', 'Oaxaca', 'Jalisco']),
      P(['¿Cómo se dice «¡Salud!» en alemán?', 'Prost!', 'Hallo!', 'Danke!', 'Tschüss!'], ['Was heißt „¡Salud!" auf Deutsch?', 'Prost!', 'Hallo!', 'Danke!', 'Tschüss!']),
      P(['¿Cuál es el ingrediente principal del guacamole?', 'Aguacate', 'Tomate', 'Pepino', 'Lima'], ['Was ist die Hauptzutat von Guacamole?', 'Avocado', 'Tomate', 'Gurke', 'Limette']),
      P(['¿Qué se celebra el 2 de noviembre en México?', 'Día de Muertos', 'La Independencia', 'Navidad', 'Carnaval'], ['Was feiert man am 2. November in Mexiko?', 'Tag der Toten', 'Unabhängigkeitstag', 'Weihnachten', 'Karneval']),
      P(['La «catrina» es…', 'Una calavera elegante', 'Un cóctel', 'Un baile', 'Un sombrero'], ['Die „Catrina" ist…', 'ein eleganter Totenkopf', 'ein Cocktail', 'ein Tanz', 'ein Hut']),
      P(['¿Cómo se dice «die Rechnung» en español?', 'La cuenta', 'La carta', 'La mesa', 'El plato'], ['Was heißt „die Rechnung" auf Spanisch?', 'La cuenta', 'La carta', 'La mesa', 'El plato']),
      P(['¿De qué región viene la cochinita pibil?', 'Yucatán', 'Sonora', 'Chihuahua', 'Baja California'], ['Aus welcher Region stammt Cochinita Pibil?', 'Yucatán', 'Sonora', 'Chihuahua', 'Baja California']),
      P(['¿Qué ingrediente sorprendente lleva el mole negro?', 'Chocolate', 'Vainilla', 'Mango', 'Miel'], ['Welche überraschende Zutat steckt im Mole Negro?', 'Schokolade', 'Vanille', 'Mango', 'Honig']),
      P(['El mezcal suele saber más… que el tequila', 'Ahumado', 'Dulce', 'Salado', 'A menta'], ['Mezcal schmeckt meist … als Tequila', 'rauchiger', 'süßer', 'salziger', 'mehr nach Minze']),
      P(['¿Qué son los «totopos»?', 'Chips de tortilla', 'Frijoles', 'Una salsa', 'Un postre'], ['Was sind „Totopos"?', 'Tortilla-Chips', 'Bohnen', 'eine Salsa', 'ein Dessert']),
      P(['¿Cuántas entidades (estados + CDMX) tiene México?', '32', '16', '50', '24'], ['Wie viele Bundesstaaten (inkl. Mexiko-Stadt) hat Mexiko?', '32', '16', '50', '24']),
      P(['¿Qué animal aparece en la bandera de México?', 'Un águila', 'Un jaguar', 'Un toro', 'Un loro'], ['Welches Tier ist auf der Flagge Mexikos?', 'Ein Adler', 'Ein Jaguar', 'Ein Stier', 'Ein Papagei']),
      P(['¿Cómo se dice «lecker» en español?', 'Rico', 'Caro', 'Frío', 'Lento'], ['Was heißt „lecker" auf Spanisch?', 'Rico', 'Caro', 'Frío', 'Lento']),
      P(['¿Qué pintora mexicana es famosa por sus autorretratos?', 'Frida Kahlo', 'Shakira', 'Salma Hayek', 'Coco Chanel'], ['Welche mexikanische Malerin ist für ihre Selbstporträts berühmt?', 'Frida Kahlo', 'Shakira', 'Salma Hayek', 'Coco Chanel']),
      P(['¿Qué es una piñata?', 'Una figura llena de dulces', 'Una fruta', 'Un baile', 'Una bebida'], ['Was ist eine Piñata?', 'Eine Figur voller Süßigkeiten', 'Eine Frucht', 'Ein Tanz', 'Ein Getränk']),
      P(['¿De qué idioma viene la palabra «chocolate»?', 'Náhuatl', 'Latín', 'Inglés', 'Árabe'], ['Aus welcher Sprache stammt das Wort „Schokolade" ursprünglich?', 'Nahuatl', 'Latein', 'Englisch', 'Arabisch']),
      P(['¿Qué número es «veinte»?', '20', '12', '70', '2'], ['Welche Zahl ist „veinte"?', '20', '12', '70', '2']),
      P(['Las quesabirrias se acompañan de…', 'Consomé para mojar', 'Helado', 'Café', 'Miel'], ['Quesabirrias werden serviert mit…', 'Consommé zum Dippen', 'Eis', 'Kaffee', 'Honig']),
      P(['¿Qué día es «martes» en alemán?', 'Dienstag', 'Montag', 'Mittwoch', 'Donnerstag'], ['Welcher Tag ist „martes"?', 'Dienstag', 'Montag', 'Mittwoch', 'Donnerstag']),
      P(['«¿Me trae otra cerveza, por favor?» en alemán es…', 'Noch ein Bier, bitte', 'Die Rechnung, bitte', 'Wo ist die Toilette?', 'Ich habe Hunger'], ['Was bedeutet „¿Me trae otra cerveza, por favor?"', 'Noch ein Bier, bitte', 'Die Rechnung, bitte', 'Wo ist die Toilette?', 'Ich habe Hunger']),
      P(['¿Qué instrumento NO suele tener un mariachi?', 'Gaita', 'Trompeta', 'Violín', 'Guitarrón'], ['Welches Instrument gehört NICHT zu einer Mariachi-Band?', 'Dudelsack', 'Trompete', 'Geige', 'Guitarrón']),
      P(['El «pico de gallo» es…', 'Una salsa fresca de tomate', 'Un pollo asado', 'Un postre', 'Un cóctel'], ['„Pico de Gallo" ist…', 'eine frische Tomatensalsa', 'ein Brathähnchen', 'ein Dessert', 'ein Cocktail']),
      P(['¿Qué océano baña Ensenada?', 'El Pacífico', 'El Atlántico', 'El Índico', 'El Ártico'], ['An welchem Ozean liegt Ensenada?', 'Pazifik', 'Atlantik', 'Indischer Ozean', 'Arktischer Ozean']),
      P(['¿Cómo se dice «Guten Appetit» en español?', 'Buen provecho', 'Buenas noches', 'Muchas gracias', 'Hasta luego'], ['Was heißt „Guten Appetit" auf Spanisch?', 'Buen provecho', 'Buenas noches', 'Muchas gracias', 'Hasta luego']),
      P(['Los tacos de pescado estilo Baja son famosos por…', 'El pescado rebozado', 'El pescado crudo', 'El pescado ahumado', 'No llevar tortilla'], ['Baja-Fischtacos sind bekannt für…', 'Fisch im Teigmantel', 'rohen Fisch', 'geräucherten Fisch', 'keine Tortilla']),
      P(['¿Qué significa «picante» en alemán?', 'scharf', 'süß', 'sauer', 'bitter'], ['Was bedeutet „picante"?', 'scharf', 'süß', 'sauer', 'bitter']),
      P(['¿Qué es el Tajín?', 'Un condimento de chile y lima', 'Un baile', 'Un queso', 'Una ciudad'], ['Was ist Tajín?', 'Ein Gewürz aus Chili und Limette', 'Ein Tanz', 'Ein Käse', 'Eine Stadt']),
      P(['¿Cómo se dice «Freund» en español?', 'Amigo', 'Hermano', 'Vecino', 'Primo'], ['Was heißt „Freund" auf Spanisch?', 'Amigo', 'Hermano', 'Vecino', 'Primo']),
    ];
    let lista; let n; let puntos; let aciertos; let orden; let fin; let tic; let respondida;

    function nueva() {
      lista = CE.barajar(PREGUNTAS).slice(0, N); n = 0; puntos = 0; aciertos = 0;
      siguiente();
    }
    function siguiente() {
      orden = CE.barajar([0, 1, 2, 3]); respondida = null;
      fin = Date.now() + TIEMPO * 1000;
      clearInterval(tic);
      tic = setInterval(() => {
        const q = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
        const r = escenario.querySelector('[data-reloj]');
        if (r) { r.textContent = q; r.parentElement.style.setProperty('--resto', `${(q / TIEMPO) * 100}%`); }
        if (q <= 0 && respondida === null) responder(-1);
      }, 200);
      pintar();
    }
    function responder(i) {
      if (respondida !== null) return;
      respondida = i;
      clearInterval(tic);
      if (i === 0) { aciertos++; puntos += 100 + Math.max(0, Math.ceil((fin - Date.now()) / 1000)) * 10; }
      pintar();
      setTimeout(() => {
        n++;
        if (n >= N) CE.finPartida(escenario, { juego: 'quiz', puntos, alOtra: nueva });
        else siguiente();
      }, 1300);
    }
    function pintar() {
      const q = lista[n][CE.idioma] || lista[n].es;
      const resta = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      escenario.innerHTML = `<div class="quiz">
        <div class="marcador-arcade"><span>${n + 1}/${N}</span><span>✅ <b>${aciertos}</b></span><span>${CE.t('ahorcado.puntos')} <b>${puntos}</b></span></div>
        <div class="quiz-tiempo" style="--resto:${(resta / TIEMPO) * 100}%"><span data-reloj>${resta}</span></div>
        <h2 class="quiz-pregunta">${CE.esc(q[0])}</h2>
        <div class="quiz-opciones">${orden.map((k) => {
          const cls = respondida === null ? '' : k === 0 ? 'bien' : k === respondida ? 'mal' : 'apagada';
          return `<button type="button" class="${cls}" data-k="${k}" ${respondida !== null ? 'disabled' : ''}>${CE.esc(q[k + 1])}</button>`;
        }).join('')}</div>
        ${respondida !== null ? `<p class="quiz-resultado ${respondida === 0 ? 'bien' : 'mal'}">${respondida === 0 ? CE.L({ es: '¡Órale! ¡Correcto!', de: '¡Órale! Richtig!' }) : respondida === -1 ? CE.L({ es: '⏰ ¡Se acabó el tiempo!', de: '⏰ Zeit ist um!' }) : CE.L({ es: '¡Ay, caramba!', de: '¡Ay, caramba!' })}</p>` : ''}
      </div>`;
    }

    escenario.addEventListener('click', (e) => {
      const b = e.target.closest('[data-k]');
      if (b) responder(Number(b.dataset.k));
    }, { signal: ac.signal });
    nueva();
    return { idioma: () => { if (!escenario.querySelector('.fin-partida')) pintar(); }, destruir: () => { ac.abort(); clearInterval(tic); } };
  },
};
