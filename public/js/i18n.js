// Textos de la web en español y alemán, y cambio de idioma.
window.CE = window.CE || {};

(() => {
  const T = {
    es: {
      'idioma.es': 'Español', 'idioma.de': 'Deutsch', 'idioma.cambiar': 'Cambiar idioma',
      'nav.carta': 'Carta', 'nav.juegos': 'Juegos', 'nav.galeria': 'Galería', 'nav.visitanos': 'Visítanos',
      'nav.menu': 'Menú',
      'nav.bar': 'Tequila bar',
      'hero.lema': 'Tacos, mole y más de 20 tequilas bajo una bóveda centenaria en la Innstadt. Ven con hambre, quédate a jugar.',
      'valoracion.opiniones': 'opiniones',
      'dest.ante': 'Lo que no te puedes perder', 'dest.titulo': 'Los favoritos de la casa',
      'banda.ante': 'Exclusivo de la cantina',
      'carta.ante': 'Cocina mexicana', 'carta.comida': 'Comer', 'carta.bebida': 'Beber',
      'carta.desde': 'desde', 'carta.favorito': 'Favorito',
      'bar.ante': 'Tequila bar', 'bar.titulo1': 'Agave, mezcal', 'bar.titulo2': 'y cócteles de autor',
      'bar.texto': 'Detrás de la barra, bajo la mirada de nuestra catrina: tequilas y mezcales para todos los gustos, margaritas y cócteles creados en casa. También sin alcohol.',
      'bar.c1': 'tequilas y mezcales', 'bar.c2': 'cócteles', 'bar.c3': 'sabores de margarita', 'bar.cta': 'Ver los cócteles',
      'galeria.ante': 'Bajo la bóveda',
      'visita.horarioNota': 'Para grupos grandes, mejor reserva.',
      'horario.cerrado': 'Cerrado', 'horario.abierto': 'Abierto ahora', 'horario.hasta': 'hasta las',
      'horario.cerradoAhora': 'Cerrado ahora', 'horario.abre': 'abre', 'horario.hoy': 'hoy', 'horario.manana': 'mañana', 'horario.a': 'a las', 'horario.el': 'el',
      'hero.verCarta': 'Ver la carta', 'hero.reservar': 'Reservar mesa', 'hero.jugar': '¡A jugar!',
      'banda.titulo': 'Juega en la mesa, gana en la barra',
      'banda.texto': 'Escanea el QR de tu mesa, entra en el ranking con tu Instagram y llévate premios cada semana.',
      'banda.c1t': 'Premios cada semana', 'banda.c1d': 'Los mejores del ranking se llevan chupitos, tacos y sorpresas.',
      'banda.c2t': 'Aprende alemán… o español', 'banda.c2d': 'Ahorcado, memoria y quiz para aprender palabras mientras cenas.',
      'banda.c3t': 'Juegos para brindar', 'banda.c3d': 'Pirinola, cubilete, la ruleta del jefe, lotería… para toda la mesa.',
      'banda.cta': 'Entrar en la sala de juegos',
      'carta.titulo': 'La carta', 'carta.sub': 'Tacos, platos de siempre, salsas hechas aquí y una barra llena de agave.',
      'carta.picante': 'Picante', 'carta.veg': 'Vegetariano', 'carta.vegano': 'Vegano',
      'carta.alergenos': '¿Alergias o intolerancias? Pregúntanos y te ayudamos encantados.',
      'demo.aviso': 'Carta según TheFork (11/2025). Se podrá editar desde el panel de administración.',
      'galeria.titulo': 'El ambiente', 'galeria.sub': 'Velas, madera, sombreros y neón. Así se vive una noche en la cantina.',
      'visita.titulo': 'Visítanos', 'visita.direccion': 'Dirección', 'visita.horario': 'Horario',
      'visita.contacto': 'Contacto', 'visita.llegar': 'Cómo llegar', 'visita.llamar': 'Llamar',
      'visita.reservar': 'Reservar online',
      'pie.impressum': 'Aviso legal', 'pie.privacidad': 'Privacidad', 'pie.hecho': 'Hecho con 🌶️ en Passau',
      // Sala de juegos
      'sala.titulo': 'Sala de juegos', 'sala.sub': 'Elige un juego. Los que llevan 🏆 entrarán en el ranking con premios.',
      'sala.volver': 'Todos los juegos', 'sala.web': 'Volver a la web', 'sala.pronto': 'Próximamente',
      'cat.arcade': 'Arcade con el jefe', 'cat.aprender': 'Aprende idiomas', 'cat.grupo': 'Para jugar en grupo',
      'cat.beber': 'Para brindar (+18)',
      'aviso18': 'Juegos para mayores de 18. Bebe con responsabilidad: cualquier reto vale también con un refresco. 🥤',
      'fin.titulo': '¡Fin de la partida!', 'fin.puntos': 'puntos', 'fin.record': '¡Nuevo récord personal!',
      'fin.mejor': 'Tu mejor marca', 'fin.otra': 'Otra partida',
      'fin.ranking': 'El ranking con premios (con tu Instagram) llega muy pronto.',
      // Ahorcado
      'ahorcado.modo.es': 'Adivinar en español', 'ahorcado.modo.de': 'Adivinar en alemán',
      'ahorcado.pista': 'Pista', 'ahorcado.vidas': 'Vidas', 'ahorcado.palabras': 'Palabras', 'ahorcado.puntos': 'Puntos',
      'ahorcado.acierto': '¡Órale! Correcto', 'ahorcado.fallo': '¡Ay, caramba! Era:',
      'ahorcado.siguiente': 'Siguiente palabra', 'ahorcado.terminar': 'Ver resultado',
      'pal.comida': 'Comida', 'pal.bebida': 'Bebida', 'pal.mesa': 'En la mesa', 'pal.frase': 'Frase', 'pal.mexico': 'México',
      // Común a los juegos de grupo
      'jug.titulo': '¿Quién juega?', 'jug.sub': 'Escribe los nombres de la mesa. Se guardan para los demás juegos.',
      'jug.nombre': 'Nombre', 'jug.anadir': 'Añadir', 'jug.quitar': 'Quitar', 'jug.empezar': 'Empezar',
      'jug.minimo': 'Hacen falta al menos {n} jugadores.', 'jug.cambiar': 'Jugadores', 'jug.turno': 'Le toca a',
      'beber.resp': 'Cualquier trago vale también sin alcohol', 'beber.carta': '¿Otra ronda? Ver bebidas',
      'edad.titulo': '¿Tienes 18 años o más?', 'edad.texto': 'Este juego es para adultos. Juega con cabeza y bebe con responsabilidad.',
      'edad.si': 'Sí, tengo 18+', 'edad.no': 'No, volver',
      'comun.siguiente': 'Siguiente', 'comun.otra': 'Otra vez', 'comun.reglas': 'Cómo se juega',
      'rk.titulo': 'Ranking del salón', 'rk.entrar': 'Suma estos puntos a tu ranking',
      'rk.instagram': 'tu_instagram', 'rk.instagramLabel': 'Tu Instagram',
      'rk.codigo': 'Código del día',
      'rk.consiente': 'Acepto que mi Instagram aparezca en el ranking público.', 'rk.bases': 'Bases',
      'rk.guardar': 'Sumar mis puntos', 'rk.guardado': '¡Puntos sumados!', 'rk.verTodo': 'Ver el top 15',
      'rk.vacio': 'Todavía no hay nadie. ¡Sé el primero!', 'rk.dia': 'Hoy', 'rk.semana': 'Semana', 'rk.mes': 'Mes',
      'rk.nota': 'Los ganadores se anuncian en nuestro Instagram. Para recoger el premio en la barra, enseña tu cuenta abierta en el móvil.', 'rk.jugar': 'Jugar ahora',
      'rk.explicaMejor': 'Se suma tu mejor partida de cada juego con ranking: ¡juega a todos para subir!',
      'rk.explicaSuma': 'Se suman todas tus partidas de los juegos con ranking: ¡cuanto más juegas, más subes!',
      'rk.tuPos': 'Tu posición', 'rk.de': 'de', 'rk.pts': 'pts', 'rk.juego': 'juego', 'rk.juegos': 'juegos', 'rk.top15': 'Top 15',
      'rk.sinIg': 'Juega a un juego con 🏆 y suma tus puntos con tu Instagram para ver aquí tu posición.',
      'rk.demo': 'DEMO · jugadores de ejemplo', 'rk.sumados': '+{p} puntos',
      'rk.error.codigo': 'El código del día no es correcto. Pídelo al camarero.',
      'rk.error.consentimiento': 'Tienes que aceptar aparecer en el ranking.',
      'rk.error.datos': 'Revisa tu Instagram: solo letras, números, puntos y guiones bajos.',
      'rk.error.espera': 'Espera unos segundos antes de volver a guardar.',
      'rk.error.juego': 'Este juego no tiene ranking.', 'rk.error.red': 'No se ha podido conectar. Inténtalo de nuevo.',
    },
    de: {
      'idioma.es': 'Español', 'idioma.de': 'Deutsch', 'idioma.cambiar': 'Sprache wechseln',
      'nav.carta': 'Speisekarte', 'nav.juegos': 'Spiele', 'nav.galeria': 'Galerie', 'nav.visitanos': 'Besuch uns',
      'nav.menu': 'Menü',
      'nav.bar': 'Tequila Bar',
      'hero.lema': 'Tacos, Mole und über 20 Tequilas unter einem jahrhundertealten Gewölbe in der Innstadt. Komm hungrig, bleib zum Spielen.',
      'valoracion.opiniones': 'Bewertungen',
      'dest.ante': 'Das musst du probieren', 'dest.titulo': 'Die Favoriten des Hauses',
      'banda.ante': 'Nur in der Cantina',
      'carta.ante': 'Cocina Mexicana', 'carta.comida': 'Essen', 'carta.bebida': 'Trinken',
      'carta.desde': 'ab', 'carta.favorito': 'Favorit',
      'bar.ante': 'Tequila Bar', 'bar.titulo1': 'Agave, Mezcal', 'bar.titulo2': '& Signature Cocktails',
      'bar.texto': 'Hinter der Bar, unter dem Blick unserer Catrina: Tequilas und Mezcals für jeden Geschmack, Margaritas und hausgemachte Cocktails. Auch alkoholfrei.',
      'bar.c1': 'Tequilas & Mezcals', 'bar.c2': 'Cocktails', 'bar.c3': 'Margarita-Sorten', 'bar.cta': 'Zu den Cocktails',
      'galeria.ante': 'Unter dem Gewölbe',
      'visita.horarioNota': 'Für größere Gruppen lieber reservieren.',
      'horario.cerrado': 'Ruhetag', 'horario.abierto': 'Jetzt geöffnet', 'horario.hasta': 'bis',
      'horario.cerradoAhora': 'Jetzt geschlossen', 'horario.abre': 'öffnet', 'horario.hoy': 'heute', 'horario.manana': 'morgen', 'horario.a': 'um', 'horario.el': 'am',
      'hero.verCarta': 'Zur Speisekarte', 'hero.reservar': 'Tisch reservieren', 'hero.jugar': '¡A jugar!',
      'banda.titulo': 'Spiel am Tisch, gewinn an der Bar',
      'banda.texto': 'Scanne den QR-Code an deinem Tisch, komm mit deinem Instagram ins Ranking und hol dir jede Woche Preise.',
      'banda.c1t': 'Jede Woche Preise', 'banda.c1d': 'Die Besten im Ranking bekommen Shots, Tacos und Überraschungen.',
      'banda.c2t': 'Spanisch lernen', 'banda.c2d': 'Galgenmännchen, Memory und Quiz – Spanisch lernen beim Essen.',
      'banda.c3t': 'Spiele zum Anstoßen', 'banda.c3d': 'Pirinola, Würfelpoker, das Glücksrad vom Chef, Lotería… für den ganzen Tisch.',
      'banda.cta': 'Zum Spielraum',
      'carta.titulo': 'Die Karte', 'carta.sub': 'Tacos, mexikanische Klassiker, hausgemachte Salsas und eine Bar voller Agave.',
      'carta.picante': 'Scharf', 'carta.veg': 'Vegetarisch', 'carta.vegano': 'Vegan',
      'carta.alergenos': 'Allergien oder Unverträglichkeiten? Frag uns einfach, wir helfen gern.',
      'demo.aviso': 'Karte laut TheFork (11/2025). Wird später im Verwaltungsbereich gepflegt.',
      'galeria.titulo': 'Die Atmosphäre', 'galeria.sub': 'Kerzen, Holz, Sombreros und Neon. So fühlt sich ein Abend in der Cantina an.',
      'visita.titulo': 'Besuch uns', 'visita.direccion': 'Adresse', 'visita.horario': 'Öffnungszeiten',
      'visita.contacto': 'Kontakt', 'visita.llegar': 'Route planen', 'visita.llamar': 'Anrufen',
      'visita.reservar': 'Online reservieren',
      'pie.impressum': 'Impressum', 'pie.privacidad': 'Datenschutz', 'pie.hecho': 'Mit 🌶️ gemacht in Passau',
      'sala.titulo': 'Spielraum', 'sala.sub': 'Wähl ein Spiel. Spiele mit 🏆 kommen ins Ranking mit Preisen.',
      'sala.volver': 'Alle Spiele', 'sala.web': 'Zur Website', 'sala.pronto': 'Demnächst',
      'cat.arcade': 'Arcade mit dem Chef', 'cat.aprender': 'Sprachen lernen', 'cat.grupo': 'Für die ganze Gruppe',
      'cat.beber': 'Zum Anstoßen (18+)',
      'aviso18': 'Spiele ab 18. Trink verantwortungsvoll: Jede Challenge geht auch mit einer Limo. 🥤',
      'fin.titulo': 'Spiel vorbei!', 'fin.puntos': 'Punkte', 'fin.record': 'Neuer persönlicher Rekord!',
      'fin.mejor': 'Deine Bestleistung', 'fin.otra': 'Nochmal spielen',
      'fin.ranking': 'Das Ranking mit Preisen (mit deinem Instagram) kommt bald.',
      'ahorcado.modo.es': 'Auf Spanisch raten', 'ahorcado.modo.de': 'Auf Deutsch raten',
      'ahorcado.pista': 'Tipp', 'ahorcado.vidas': 'Leben', 'ahorcado.palabras': 'Wörter', 'ahorcado.puntos': 'Punkte',
      'ahorcado.acierto': '¡Órale! Richtig', 'ahorcado.fallo': '¡Ay, caramba! Es war:',
      'ahorcado.siguiente': 'Nächstes Wort', 'ahorcado.terminar': 'Ergebnis ansehen',
      'pal.comida': 'Essen', 'pal.bebida': 'Getränk', 'pal.mesa': 'Am Tisch', 'pal.frase': 'Redewendung', 'pal.mexico': 'Mexiko',
      'jug.titulo': 'Wer spielt mit?', 'jug.sub': 'Trag die Namen am Tisch ein. Sie bleiben für die anderen Spiele gespeichert.',
      'jug.nombre': 'Name', 'jug.anadir': 'Hinzufügen', 'jug.quitar': 'Entfernen', 'jug.empezar': 'Los geht’s',
      'jug.minimo': 'Mindestens {n} Spieler nötig.', 'jug.cambiar': 'Spieler', 'jug.turno': 'Dran ist',
      'beber.resp': 'Jeder Schluck zählt auch alkoholfrei', 'beber.carta': 'Noch eine Runde? Zur Getränkekarte',
      'edad.titulo': 'Bist du 18 oder älter?', 'edad.texto': 'Dieses Spiel ist für Erwachsene. Spiel mit Köpfchen und trink verantwortungsvoll.',
      'edad.si': 'Ja, ich bin 18+', 'edad.no': 'Nein, zurück',
      'comun.siguiente': 'Weiter', 'comun.otra': 'Nochmal', 'comun.reglas': 'So wird gespielt',
      'rk.titulo': 'Spielhallen-Ranking', 'rk.entrar': 'Punkte deinem Ranking gutschreiben',
      'rk.instagram': 'dein_instagram', 'rk.instagramLabel': 'Dein Instagram',
      'rk.codigo': 'Code des Tages',
      'rk.consiente': 'Ich bin einverstanden, dass mein Instagram im öffentlichen Ranking erscheint.', 'rk.bases': 'Teilnahmebedingungen',
      'rk.guardar': 'Punkte gutschreiben', 'rk.guardado': 'Punkte gutgeschrieben!', 'rk.verTodo': 'Zu den Top 15',
      'rk.vacio': 'Noch niemand hier. Sei die/der Erste!', 'rk.dia': 'Heute', 'rk.semana': 'Woche', 'rk.mes': 'Monat',
      'rk.nota': 'Die Gewinner geben wir auf Instagram bekannt. Zum Abholen an der Bar zeigst du dein geöffnetes Konto auf dem Handy.', 'rk.jugar': 'Jetzt spielen',
      'rk.explicaMejor': 'Gezählt wird deine beste Runde in jedem Ranking-Spiel: Spiel alle, um aufzusteigen!',
      'rk.explicaSuma': 'Alle deine Runden in den Ranking-Spielen zählen: Je mehr du spielst, desto höher kommst du!',
      'rk.tuPos': 'Dein Platz', 'rk.de': 'von', 'rk.pts': 'Pkt.', 'rk.juego': 'Spiel', 'rk.juegos': 'Spiele', 'rk.top15': 'Top 15',
      'rk.sinIg': 'Spiel ein Spiel mit 🏆 und schreib dir die Punkte mit deinem Instagram gut, um hier deinen Platz zu sehen.',
      'rk.demo': 'DEMO · Beispielspieler', 'rk.sumados': '+{p} Punkte',
      'rk.error.codigo': 'Der Code des Tages stimmt nicht. Frag beim Service nach.',
      'rk.error.consentimiento': 'Bitte bestätige, dass du im Ranking erscheinen möchtest.',
      'rk.error.datos': 'Prüfe dein Instagram: nur Buchstaben, Zahlen, Punkte und Unterstriche.',
      'rk.error.espera': 'Warte ein paar Sekunden, bevor du erneut speicherst.',
      'rk.error.juego': 'Dieses Spiel hat kein Ranking.', 'rk.error.red': 'Keine Verbindung. Bitte versuch es nochmal.',
    },
  };

  const BANDERAS = {
    es: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="10" height="20" fill="#006847"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ce1126"/><circle cx="15" cy="10" r="3" fill="#8c5a2b"/><path d="M12.6 11.6q2.4 1.6 4.8 0" stroke="#3f7d3a" stroke-width=".8" fill="none"/></svg>',
    de: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="7" fill="#000"/><rect y="6.66" width="30" height="6.67" fill="#dd0000"/><rect y="13.33" width="30" height="6.67" fill="#ffce00"/></svg>',
  };

  function idiomaInicial() {
    try {
      const url = new URLSearchParams(location.search).get('lang');
      if (url === 'es' || url === 'de') return url;
      const g = localStorage.getItem('ce-idioma');
      if (g === 'es' || g === 'de') return g;
    } catch (e) { /* sin almacenamiento */ }
    return (navigator.language || 'de').toLowerCase().startsWith('es') ? 'es' : 'de';
  }

  CE.idioma = idiomaInicial();
  CE.t = (k) => T[CE.idioma][k] ?? T.es[k] ?? k;
  // Campo bilingüe de un objeto: tx(plato, 'nombre') → plato.nombre_es / plato.nombre_de
  CE.tx = (o, campo) => (o && (o[`${campo}_${CE.idioma}`] || o[`${campo}_es`] || o[`${campo}_de`])) || '';
  CE.bandera = (l) => BANDERAS[l];
  // Texto bilingüe en línea: CE.L({ es: 'Hola', de: 'Hallo' })
  CE.L = (o) => (typeof o === 'string' ? o : o[CE.idioma] ?? o.es);

  CE.aplicarIdioma = () => {
    document.documentElement.lang = CE.idioma;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = CE.t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', CE.t(el.dataset.i18nAria)));
    document.querySelectorAll('.idiomas button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === CE.idioma)));
    document.dispatchEvent(new CustomEvent('idioma', { detail: CE.idioma }));
  };

  CE.ponerIdioma = (l) => {
    CE.idioma = l;
    try { localStorage.setItem('ce-idioma', l); } catch (e) { /* nada */ }
    CE.aplicarIdioma();
  };

  // Rellena los selectores de idioma [data-idiomas] con las dos banderas
  CE.montarIdiomas = () => {
    document.querySelectorAll('[data-idiomas]').forEach((cont) => {
      cont.classList.add('idiomas');
      cont.setAttribute('role', 'group');
      cont.dataset.i18nAria = 'idioma.cambiar';
      cont.innerHTML = ['es', 'de'].map((l) =>
        `<button type="button" data-lang="${l}" title="${T[l][`idioma.${l}`]}">${BANDERAS[l]}<span>${l.toUpperCase()}</span></button>`).join('');
      cont.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-lang]');
        if (b) CE.ponerIdioma(b.dataset.lang);
      });
    });
  };
})();
