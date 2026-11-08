// Juegos de cartas para la mesa: "Yo nunca", "Verdad o reto" y "¿Quién es más probable…?".
// Todos usan el mismo motor: uno o varios mazos de frases ES/DE.
CE.juegoCartas = (cfg) => ({
  iniciar(escenario) {
    const ac = new AbortController();
    const esc = CE.esc;
    const mazos = Object.fromEntries(Object.entries(cfg.mazos).map(([k, m]) => [k, { ...m, pila: CE.barajar(m.cartas) }]));
    const jugadores = cfg.turnos ? CE.jugadores.lista() : [];
    let carta = null; let mazo = null; let n = 0;

    const texto = (c) => CE.L(c).replace('{ig}', `@${CE.ajustes?.instagram || ''}`);

    function sacar(k) {
      const m = mazos[k];
      if (!m.pila.length) m.pila = CE.barajar(m.cartas);
      carta = m.pila.pop(); mazo = k; n++;
      pintar(true);
    }

    function pintar(animar) {
      const m = mazo && mazos[mazo];
      const quien = jugadores.length ? jugadores[(n - 1) % jugadores.length] : '';
      escenario.innerHTML = `<div class="cartas">
        <p class="cartas-reglas">${CE.L(cfg.reglas)}</p>
        ${carta && quien ? `<p class="cartas-turno">${CE.t('jug.turno')}: <b>${esc(quien)}</b></p>` : ''}
        <div class="carta-grande ${animar ? 'gira' : ''}" style="--c:${m ? m.color : cfg.color}">
          ${carta
            ? `<span class="carta-tipo">${m.icono} ${CE.L(m.nombre)}</span><p>${esc(texto(carta))}</p>`
            : `<span class="carta-portada">${cfg.icono}</span><p>${CE.L(cfg.empezar)}</p>`}
          <span class="carta-esquina" aria-hidden="true">${cfg.icono}</span>
        </div>
        <div class="cartas-botones">${Object.entries(mazos).map(([k, mz]) =>
          `<button class="boton" type="button" style="background:${mz.color}" data-mazo="${k}">${mz.icono} ${CE.L(mz.boton)}</button>`).join('')}</div>
        ${CE.pieBeber()}
      </div>`;
    }

    escenario.addEventListener('click', (e) => {
      const b = e.target.closest('[data-mazo]');
      if (b) sacar(b.dataset.mazo);
    }, { signal: ac.signal });
    pintar(false);
    return { idioma: () => pintar(false), destruir: () => ac.abort() };
  },
});

CE.juegos.yonunca = CE.juegoCartas({
  icono: '🙊', color: '#6b3fa0',
  reglas: { es: 'Lee la frase en voz alta. Quien SÍ lo haya hecho, bebe un trago.', de: 'Lies den Satz laut vor. Wer es SCHON gemacht hat, trinkt einen Schluck.' },
  empezar: { es: 'Pulsa para sacar la primera carta', de: 'Tippe, um die erste Karte zu ziehen' },
  mazos: {
    yonunca: {
      nombre: { es: 'Yo nunca…', de: 'Ich hab noch nie…' }, boton: { es: 'Siguiente carta', de: 'Nächste Karte' },
      icono: '🙊', color: '#6b3fa0',
      cartas: [
        { es: 'Yo nunca he comido un chile entero.', de: 'Ich hab noch nie eine ganze Chili gegessen.' },
        { es: 'Yo nunca he fingido que me gustaba un regalo.', de: 'Ich hab noch nie so getan, als würde mir ein Geschenk gefallen.' },
        { es: 'Yo nunca me he pasado de parada por quedarme dormido.', de: 'Ich hab noch nie meine Haltestelle verschlafen.' },
        { es: 'Yo nunca he bailado encima de una mesa.', de: 'Ich hab noch nie auf einem Tisch getanzt.' },
        { es: 'Yo nunca he mandado un mensaje a la persona equivocada.', de: 'Ich hab noch nie eine Nachricht an die falsche Person geschickt.' },
        { es: 'Yo nunca he estado en México.', de: 'Ich war noch nie in Mexiko.' },
        { es: 'Yo nunca he cantado en un karaoke.', de: 'Ich hab noch nie Karaoke gesungen.' },
        { es: 'Yo nunca he olvidado el cumpleaños de mi mejor amigo o amiga.', de: 'Ich hab noch nie den Geburtstag meiner besten Freundin oder meines besten Freundes vergessen.' },
        { es: 'Yo nunca he cotilleado el Instagram de mi ex.', de: 'Ich hab noch nie das Instagram von meinem Ex gestalkt.' },
        { es: 'Yo nunca he desayunado tacos.', de: 'Ich hab noch nie Tacos zum Frühstück gegessen.' },
        { es: 'Yo nunca me he caído en plena calle.', de: 'Ich bin noch nie mitten auf der Straße hingefallen.' },
        { es: 'Yo nunca he probado el mezcal.', de: 'Ich hab noch nie Mezcal probiert.' },
        { es: 'Yo nunca he tenido un amor de verano.', de: 'Ich hatte noch nie eine Sommerliebe.' },
        { es: 'Yo nunca he mentido sobre mi edad.', de: 'Ich hab noch nie über mein Alter gelogen.' },
        { es: 'Yo nunca le he hecho ghosting a nadie.', de: 'Ich hab noch nie jemanden geghostet.' },
        { es: 'Yo nunca he llorado con una película de dibujos.', de: 'Ich hab noch nie bei einem Zeichentrickfilm geweint.' },
        { es: 'Yo nunca he perdido el móvil de fiesta.', de: 'Ich hab noch nie auf einer Party mein Handy verloren.' },
        { es: 'Yo nunca he pedido comida a domicilio dos veces el mismo día.', de: 'Ich hab noch nie zweimal am selben Tag Essen bestellt.' },
        { es: 'Yo nunca he suspendido un examen.', de: 'Ich bin noch nie durch eine Prüfung gefallen.' },
        { es: 'Yo nunca me he dormido en la biblioteca de la uni.', de: 'Ich bin noch nie in der Uni-Bibliothek eingeschlafen.' },
        { es: 'Yo nunca he ido a clase con resaca.', de: 'Ich war noch nie verkatert in der Vorlesung.' },
        { es: 'Yo nunca he pedido en español en un restaurante.', de: 'Ich hab noch nie im Restaurant auf Spanisch bestellt.' },
        { es: 'Yo nunca he pedido "lo mismo que él" sin mirar la carta.', de: 'Ich hab noch nie „das Gleiche wie er" bestellt, ohne in die Karte zu schauen.' },
        { es: 'Yo nunca me he bañado en el Danubio.', de: 'Ich war noch nie in der Donau schwimmen.' },
        { es: 'Yo nunca he cruzado a Austria solo para comprar algo.', de: 'Ich bin noch nie nur zum Einkaufen nach Österreich gefahren.' },
        { es: 'Yo nunca me he enamorado de alguien de esta mesa.', de: 'Ich hab mich noch nie in jemanden an diesem Tisch verliebt.' },
        { es: 'Yo nunca he dicho "te quiero" demasiado pronto.', de: 'Ich hab noch nie zu früh „Ich liebe dich" gesagt.' },
        { es: 'Yo nunca he llegado tarde a mi propia fiesta.', de: 'Ich bin noch nie zu spät zu meiner eigenen Party gekommen.' },
        { es: 'Yo nunca me he colado en una fiesta sin invitación.', de: 'Ich hab mich noch nie ohne Einladung auf eine Party geschlichen.' },
        { es: 'Yo nunca he tenido una cita a ciegas.', de: 'Ich hatte noch nie ein Blind Date.' },
      ],
    },
  },
});

CE.juegos.verdadreto = CE.juegoCartas({
  icono: '🔥', color: '#d7263d', turnos: true,
  reglas: { es: 'Elige verdad o reto. Si no quieres contestar o cumplir el reto, bebes dos tragos.', de: 'Wähl Wahrheit oder Pflicht. Wer nicht antworten oder die Aufgabe nicht machen will, trinkt zwei Schlucke.' },
  empezar: { es: '¿Verdad… o reto?', de: 'Wahrheit… oder Pflicht?' },
  mazos: {
    verdad: {
      nombre: { es: 'Verdad', de: 'Wahrheit' }, boton: { es: 'Verdad', de: 'Wahrheit' }, icono: '🤫', color: '#0e7c86',
      cartas: [
        { es: '¿Cuál ha sido tu peor cita?', de: 'Was war dein schlimmstes Date?' },
        { es: '¿Qué es lo más vergonzoso que tienes en el móvil?', de: 'Was ist das Peinlichste auf deinem Handy?' },
        { es: '¿A quién de esta mesa te llevarías a una isla desierta?', de: 'Wen von diesem Tisch würdest du auf eine einsame Insel mitnehmen?' },
        { es: '¿Cuál es tu canción vergonzosa favorita?', de: 'Was ist dein peinliches Lieblingslied?' },
        { es: '¿Qué es lo más raro que has comido nunca?', de: 'Was ist das Seltsamste, das du je gegessen hast?' },
        { es: '¿Cuál ha sido tu mayor mentira a tus padres?', de: 'Was war deine größte Lüge gegenüber deinen Eltern?' },
        { es: '¿Con qué famoso o famosa tendrías una cita?', de: 'Mit welchem Promi hättest du gern ein Date?' },
        { es: '¿Qué te saca de quicio de alguien de esta mesa? (con cariño)', de: 'Was nervt dich an jemandem an diesem Tisch? (mit Liebe)' },
        { es: '¿Cuál es el último mensaje que has borrado y por qué?', de: 'Welche Nachricht hast du zuletzt gelöscht – und warum?' },
        { es: '¿Qué harías si mañana te tocara la lotería?', de: 'Was würdest du tun, wenn du morgen im Lotto gewinnst?' },
        { es: '¿Quién de esta mesa crees que acabará siendo famoso?', de: 'Wer an diesem Tisch wird deiner Meinung nach berühmt?' },
        { es: '¿Te has enamorado alguna vez de un profesor o profesora?', de: 'Warst du schon mal in eine Lehrkraft verknallt?' },
        { es: '¿Qué es lo más loco que has hecho por amor?', de: 'Was ist das Verrückteste, das du aus Liebe getan hast?' },
        { es: '¿Cuál es tu peor manía?', de: 'Was ist deine schlimmste Angewohnheit?' },
        { es: '¿Qué cotilleo te ha sorprendido más este año?', de: 'Welcher Klatsch hat dich dieses Jahr am meisten überrascht?' },
        { es: '¿Qué es algo que nunca le contarías a tu jefe?', de: 'Was würdest du deinem Chef nie erzählen?' },
        { es: '¿Cuál es tu plato favorito de la carta y por qué?', de: 'Was ist dein Lieblingsgericht auf der Karte und warum?' },
        { es: '¿Cuál fue tu primera impresión de la persona de tu izquierda?', de: 'Was war dein erster Eindruck von der Person links neben dir?' },
        { es: 'Si tuvieras que vivir en otro país, ¿cuál sería?', de: 'Wenn du in einem anderen Land leben müsstest, welches wäre es?' },
        { es: '¿Qué es lo que más miedo te da?', de: 'Wovor hast du am meisten Angst?' },
      ],
    },
    reto: {
      nombre: { es: 'Reto', de: 'Pflicht' }, boton: { es: 'Reto', de: 'Pflicht' }, icono: '🔥', color: '#d7263d',
      cartas: [
        { es: 'Pide tu próxima bebida al camarero en español.', de: 'Bestell dein nächstes Getränk beim Kellner auf Spanisch.' },
        { es: 'Brinda con toda la mesa gritando: "¡Arriba, abajo, al centro y pa’ dentro!"', de: 'Stoß mit allen an und ruf: „¡Arriba, abajo, al centro y pa’ dentro!"' },
        { es: 'Canta como un mariachi durante 10 segundos.', de: 'Sing 10 Sekunden lang wie ein Mariachi.' },
        { es: 'Prueba la salsa más picante de la mesa (o bebe dos tragos).', de: 'Probier die schärfste Salsa am Tisch (oder trink zwei Schlucke).' },
        { es: 'Habla con acento mexicano hasta tu próximo turno.', de: 'Sprich bis zu deiner nächsten Runde mit mexikanischem Akzent.' },
        { es: 'Haz un selfie de grupo y súbelo a tu story etiquetando a {ig}.', de: 'Mach ein Gruppenselfie und poste es in deiner Story mit {ig} markiert.' },
        { es: 'Baila 15 segundos con alguien de la mesa.', de: 'Tanz 15 Sekunden mit jemandem vom Tisch.' },
        { es: 'Di tres veces seguidas: "Tres tristes tigres tragaban trigo en un trigal".', de: 'Sag dreimal schnell: „Tres tristes tigres tragaban trigo en un trigal".' },
        { es: 'Cambia de sitio con la persona que elija la mesa.', de: 'Tausch den Platz mit der Person, die der Tisch aussucht.' },
        { es: 'Canta el estribillo de "Cielito lindo": ¡Ay, ay, ay, ay, canta y no llores!', de: 'Sing den Refrain von „Cielito lindo": ¡Ay, ay, ay, ay, canta y no llores!' },
        { es: 'Deja que la mesa elija tu próxima bebida de la carta.', de: 'Lass den Tisch dein nächstes Getränk von der Karte aussuchen.' },
        { es: 'Cuenta un chiste. Si nadie se ríe, bebes.', de: 'Erzähl einen Witz. Wenn keiner lacht, trinkst du.' },
        { es: 'Hasta tu próximo turno, solo puedes hablar en español.', de: 'Bis zu deiner nächsten Runde darfst du nur Spanisch sprechen.' },
        { es: 'Lanza tu mejor grito mexicano: "¡Ajúa!"', de: 'Lass deinen besten mexikanischen Schrei los: „¡Ajúa!"' },
        { es: 'Ponte algo de la mesa en la cabeza como si fuera un sombrero durante un minuto.', de: 'Setz dir eine Minute lang etwas vom Tisch wie einen Sombrero auf.' },
        { es: 'Enseña a la mesa la última foto de tu galería.', de: 'Zeig dem Tisch das letzte Foto in deiner Galerie.' },
        { es: 'Pídele al camarero que te recomiende un chupito… y pruébalo (o un refresco).', de: 'Lass dir vom Kellner einen Shot empfehlen… und probier ihn (oder eine Limo).' },
        { es: 'Manda un audio a tu madre diciendo "te quiero, mamá" en español.', de: 'Schick deiner Mutter eine Sprachnachricht: „te quiero, mamá".' },
        { es: 'Imita al jefe del restaurante (con cariño).', de: 'Imitiere den Chef des Restaurants (mit Liebe).' },
        { es: 'Haz una reseña en voz alta de tu plato como si fueras crítico gastronómico.', de: 'Bewerte dein Essen laut wie ein Restaurantkritiker.' },
      ],
    },
  },
});

CE.juegos.masprobable = CE.juegoCartas({
  icono: '👉', color: '#0e7c86',
  reglas: { es: 'Leed la carta, contad hasta tres y señalad a la vez. Quien reciba más dedos, bebe.', de: 'Karte vorlesen, bis drei zählen und gleichzeitig zeigen. Wer die meisten Finger abbekommt, trinkt.' },
  empezar: { es: '¿Quién de la mesa…?', de: 'Wer am Tisch…?' },
  mazos: {
    carta: {
      nombre: { es: '¿Quién es más probable que…', de: 'Wer würde am ehesten…' }, boton: { es: 'Siguiente carta', de: 'Nächste Karte' },
      icono: '👉', color: '#0e7c86',
      cartas: [
        { es: '…acabe viviendo en México?', de: '…nach Mexiko auswandern?' },
        { es: '…se coma un chile entero por una apuesta?', de: '…für eine Wette eine ganze Chili essen?' },
        { es: '…pierda el móvil esta noche?', de: '…heute Abend sein Handy verlieren?' },
        { es: '…se case en Las Vegas?', de: '…in Las Vegas heiraten?' },
        { es: '…llegue tarde a su propia boda?', de: '…zu spät zur eigenen Hochzeit kommen?' },
        { es: '…se haga famoso en TikTok?', de: '…auf TikTok berühmt werden?' },
        { es: '…pida otra ronda?', de: '…noch eine Runde bestellen?' },
        { es: '…se quede dormido en la mesa?', de: '…am Tisch einschlafen?' },
        { es: '…se haga amigo de todo el bar?', de: '…sich mit der ganzen Bar anfreunden?' },
        { es: '…gane el ranking de esta semana?', de: '…das Ranking dieser Woche gewinnen?' },
        { es: '…llore con una película?', de: '…bei einem Film weinen?' },
        { es: '…se gaste el sueldo en un día?', de: '…sein ganzes Gehalt an einem Tag ausgeben?' },
        { es: '…sobreviva a un apocalipsis zombi?', de: '…eine Zombie-Apokalypse überleben?' },
        { es: '…olvide el cumpleaños de su pareja?', de: '…den Geburtstag vom Partner vergessen?' },
        { es: '…hable español perfecto en un año?', de: '…in einem Jahr perfekt Spanisch sprechen?' },
        { es: '…salga en las noticias?', de: '…in den Nachrichten landen?' },
        { es: '…llegue a ser presidente del país?', de: '…Bundeskanzler werden?' },
        { es: '…adopte diez gatos?', de: '…zehn Katzen adoptieren?' },
        { es: '…le escriba a su ex esta noche?', de: '…heute Nacht dem Ex schreiben?' },
        { es: '…baile encima de la mesa?', de: '…auf dem Tisch tanzen?' },
        { es: '…pida lo más picante de la carta?', de: '…das Schärfste auf der Karte bestellen?' },
        { es: '…invite a todos a la próxima ronda?', de: '…allen die nächste Runde ausgeben?' },
        { es: '…se apunte a clases de salsa?', de: '…einen Salsa-Kurs machen?' },
        { es: '…se pierda volviendo a casa?', de: '…sich auf dem Heimweg verlaufen?' },
      ],
    },
  },
});
