// Datos de ejemplo mientras no hay Supabase configurado (y origen de supabase/semilla.sql).
// Carta: transcrita de TheFork (actualizada el 18/11/2025). Traducciones al español: revisar con el restaurante.
// Horario: de directorios públicos, CONFIRMAR.
window.CE = window.CE || {};

(() => {
  const platos = [];
  let cat; let sub;
  // C(categoría, [subcategoría_es, subcategoría_de])
  const C = (c, s) => { cat = c; sub = s || null; };
  // I(nombre | [es, de], precio, [desc_es, desc_de] | null, extras)
  const I = (nombre, precio, desc, extra = {}) => {
    const [nes, nde] = Array.isArray(nombre) ? nombre : [nombre, null];
    platos.push({
      cat, sub_es: sub?.[0] || null, sub_de: sub?.[1] || null,
      nombre_es: nes, nombre_de: nde, precio,
      desc_es: desc?.[0] || null, desc_de: desc?.[1] || null, ...extra,
    });
  };
  const V = (es, de, precio) => ({ es, de, precio }); // variante con precio propio

  // ---------------- COMIDA ----------------
  C('ensaladas');
  const mezcla = ['Mezcla fresca de lechugas de temporada, tomate cherry, pepino, zanahoria, frijoles negros, maíz y cebolla morada.',
    'Frische Mischung aus saisonalen Blattsalaten, Kirschtomaten, Gurken, Karotten, schwarzen Bohnen, Mais und roten Zwiebeln.'];
  I('Ensalada pequeña', 6.5, mezcla, { veg: true });
  I('Ensalada grande', 12.5, mezcla, { veg: true });
  I('Verde y rojo bowl', 13.9, ['Bowl colorido con aguacate cremoso, tomate, maíz, cebolla, rábanos, frijoles negros y queso fresco desmenuzado.',
    'Farbenfrohe Bowl mit cremiger Avocado, Tomate, Mais, Zwiebeln, Radieschen, schwarzen Bohnen und gebröseltem Frischkäse.'], { veg: true });
  I('Ensalada de carne', 18.9, ['Ensalada crujiente con tiras de steak a la parrilla, frijoles negros, maíz, tomate y tiras de tortilla crujientes.',
    'Knackiger Salat mit gegrillten Steakstreifen, schwarzen Bohnen, Mais, Tomaten und knusprigen Tortilla-Streifen.']);
  I(['Ensalada César', 'Caesar Salat'], 16.5, ['Lechuga romana, aliño César casero especiado, parmesano, picatostes y pollo tierno.',
    'Römersalat, hausgemachtes pikantes Caesar-Dressing, Parmesan, Croûtons und zartes Hähnchen.']);
  I('Sopa de tortilla', 7.9, ['Caldo de tomate especiado con tiras de tortilla, aguacate, crema, queso fresco, rábanos y cilantro. Un clásico mexicano.',
    'Würzige Tomatenbrühe mit Tortilla-Streifen, Avocado, Sauerrahm, Queso Fresco, Radieschen und Koriander. Ein mexikanischer Klassiker.']);

  C('entrantes');
  I(['Elote callejero', 'Street-Style Corn'], 8.5, ['Puré de maíz asado y elote a la parrilla, alioli de chipotle, crema, queso cotija, chile piquín, aceite de trufa blanca y cilantro.',
    'Gegrilltes Maispüree und Mais, Chipotle-Aioli, Crema, Queso Cotija, Pequín-Chili, weißes Trüffelöl und Koriander.'], { veg: true, picante: 1 });
  I(['Trío de salsas con totopos', 'Trio de Salsas con Totopos'], 8.9, ['Totopos de maíz crujientes con nuestro trío de salsas: guacamole, salsa roja y x-ni-pek.',
    'Knusprige Mais-Tortilla-Chips mit unserem Dip-Trio: Guacamole, Salsa Roja und X-ni-pek.'], { vegano: true, picante: 1 });
  I('Nachos con chorizo y frijoles', 13.9, ['Totopos con frijoles refritos, chorizo, cheddar fundido y jalapeños.',
    'Tortilla-Chips mit cremigem Bohnenmus, Chorizo, geschmolzenem Cheddar und Jalapeños.'], { picante: 1 });
  I('Papas fritas con carne', 14.9, ['Patatas fritas con carne picada de ternera especiada, salsa de cheddar casera y cebolleta.',
    'Pommes mit würzigem Rinderhack, hausgemachter Cheddar-Sauce und Frühlingszwiebeln.']);
  I('Chilaquiles verdes con totopos', 13.9, ['Totopos bañados en salsa verde de tomatillo con queso, cebolla, crema y pollo tierno.',
    'Tortilla-Chips in würziger Salsa Verde mit Käse, Zwiebeln, Crema und zartem Hähnchen.'], { picante: 1 });

  C('tacos');
  I(['Tacos de pollo al pastor', 'Pollo al Pastor Tacos'], 16.5, ['Pollo al pastor a la parrilla, crema de aguacate, piña, cebolla, cilantro y tortilla de maíz.',
    'Gegrilltes Hähnchen al Pastor, Avocado-Crema, Ananas, Zwiebeln, Koriander, Maistortilla.']);
  I('Carnitas michoacanas', 16.9, ['Cerdo confitado, crema de aguacate, cebolla, cilantro y tortilla de maíz.',
    'Schweinefleisch, Avocado-Crema, Zwiebeln, Koriander, Maistortilla.']);
  I('Tacos de camarón', 18.9, ['Camarones, mozzarella, crema de aguacate, cebolla, cilantro y tortilla de trigo.',
    'Garnelen, Mozzarella, Avocado-Crema, Zwiebeln, Koriander, Weizentortilla.']);
  I(['Tacos de pescado estilo Baja', 'Baja-Style Fish Tacos'], 17.9, ['Pescado rebozado en cerveza, ensalada de col, alioli de chipotle, cilantro, queso, cebolla y tortilla de trigo. ¡El clásico de Ensenada!',
    'Fischfilet im Bierteig, Mexican Slaw, Chipotle-Aioli, Koriander, Käse, Zwiebeln, Weizentortilla. Der Klassiker aus Ensenada!'], { destacado: true, foto: 'assets/fotos/tacos-baja.webp' });
  I('Quesabirrias con consomé', 19.9, ['Ternera guisada a fuego lento estilo Jalisco, queso Monterey Jack, cebolla, cilantro, tortillas de maíz y consomé para mojar.',
    'Langsam geschmortes Rindfleisch nach Jalisco-Art, Monterey Jack, Zwiebeln, Koriander, Maistortillas und Consommé zum Dippen.'], { destacado: true });
  I(['Tacos de barbacoa', 'Barbacoa Tacos'], 17.9, ['Ternera guisada a fuego lento, salsa, crema de aguacate, cebolla, cilantro y tortillas de maíz.',
    'Langsam geschmortes Rindfleisch, Salsa, Avocado-Crema, Zwiebeln, Koriander, Maistortillas.']);
  I(['Tacos de steak y queso', 'Steak & Cheese Tacos'], 19.9, ['Steak de ribeye, queso Monterey Jack, crema de aguacate, salsa ranchera, cebolla, cilantro y tortilla de maíz.',
    'Ribeye-Steak, Monterey Jack, Avocado-Crema, Salsa Ranchera, Zwiebeln, Koriander, Maistortilla.']);
  I(['Tacos de setas', 'Mushroom Tacos'], 15.5, ['Setas fritas, salsa, mozzarella, cebolla, cilantro y tortillas de maíz.',
    'Frittierte Pilze, Salsa, Mozzarella, Zwiebeln, Koriander, Maistortillas.'], { veg: true });

  C('platos');
  I('Enchiladas', 16.9, ['Tortillas de maíz rellenas a elegir, gratinadas con queso y servidas con crema, cebolla blanca y cilantro.',
    'Weiche Maistortillas, gefüllt nach Wahl, mit geschmolzenem Käse, Crema, weißen Zwiebeln und Koriander.'], {
    opciones_es: 'Salsa: roja (ahumada y especiada), verde (fresca y ácida) o mole (dulce y especiada)',
    opciones_de: 'Sauce: Roja (rauchig-würzig), Verde (frisch-spritzig) oder Mole (süß-würzig)',
    variantes: [V('Setas', 'Pilze', 16.9), V('Chorizo', 'Chorizo', 17.9), V('Pollo', 'Hähnchen', 18.5), V('Steak', 'Steak', 20.5), V('Camarones', 'Garnelen', 21.5)] });
  I(['Mole negro de Oaxaca', 'Mole Negro Oaxaca'], 20.5, ['Pollo tierno bañado en nuestro mole de la casa: chiles ahumados, mantequilla de frutos secos, especias y chocolate mexicano.',
    'Zartes Hähnchen in unserer Signature-Sauce aus rauchigen Chilis, cremiger Nussbutter, Gewürzen und mexikanischer Schokolade.'], { destacado: true });
  I('Cochinita pibil', 19.5, ['Cerdo al estilo de Yucatán marinado en achiote y cocinado a fuego lento, con sémola de maíz cremosa, tortillas, cebolla morada y salsa de aguacate.',
    'Yucatán-Schweinefleisch, in Achiote mariniert und langsam geschmort, mit cremigem Maisgrieß, Tortillas, roten Zwiebeln und Avocado-Salsa.']);
  I('Salmón en salsa de aguacate', 23.5, ['Salmón a la parrilla en salsa cremosa de aguacate y tomatillo, con arroz mexicano, verduras asadas y tortillas de maíz.',
    'Gegrillter Lachs in cremiger Avocado-Tomatillo-Sauce mit mexikanischem Reis, Grillgemüse und warmen Maistortillas.']);
  I('Burrito', 16.9, ['Con aguacate, pico de gallo, queso, lechuga, alioli de chipotle, cebolla, frijoles refritos y arroz. Con guacamole y crema agria.',
    'Mit Avocado, Tomaten-Salsa, Käse, Salat, Chipotle-Aioli, Zwiebeln, Refried Beans und Reis, dazu Guacamole und Sour Cream.'], {
    variantes: [V('Portobello y maíz', 'Portobello & Mais', 16.9), V('Pollo a la parrilla', 'Gegrillte Hähnchenbrust', 17.9), V('Ternera', 'Rindfleisch', 19.9)] });
  I('Fajitas', 18.9, ['En sartén de hierro bien caliente con pimientos y cebolla, tortillas para enrollar, salsa roja de chile ancho, crema agria y guacamole.',
    'In der heißen Gusseisenpfanne mit Paprika und Zwiebeln, dazu Tortillas, Salsa Roja de Chile Ancho, Crema Agria und Guacamole.'], {
    variantes: [V('Vegana (calabacín, portobello, boniato, espinaca)', 'Vegan (Zucchini, Portobello, Süßkartoffel, Spinat)', 18.9),
      V('Pollo', 'Hähnchen', 19.9), V('Ternera', 'Rindfleisch', 21.9), V('Camarones', 'Garnelen', 22.9)] });

  C('burger');
  I('Hamburger', 10, ['Ternera, lechuga, tomate, cebolla morada, kétchup y mayonesa.', 'Feinstes Beef, Salat, Tomate, rote Zwiebeln, Ketchup und Mayonnaise.']);
  I('Cheese Burger', 11, ['Ternera, cheddar, lechuga, tomate, cebolla morada, pepinillo, cebolla caramelizada y salsa burger.',
    'Beef, Cheddar, Salat, Tomate, rote Zwiebeln, Gurken, karamellisierte Zwiebeln und Burger-Sauce.']);
  I('Toro Bravo Burger', 17, ['Doble de ternera, cheddar, lechuga, tomate, cebolla morada, pepinillo, cebolla caramelizada y salsa burger.',
    'Doppelt Beef, Cheddar, Salat, Tomate, rote Zwiebeln, Gurken, karamellisierte Zwiebeln und Burger-Sauce.']);
  I('BBQ Cheese Burger', 12.9, ['Ternera con bacon, cheddar, lechuga, tomate, cebolla, pepinillo, cebolla caramelizada y salsa barbacoa.',
    'Beef mit Bacon, Cheddar, Salat, Tomate, Zwiebeln, Gurken, karamellisierte Zwiebeln und BBQ-Sauce.']);
  I("Guac 'n' Spice Burger", 12.5, ['Ternera con cheddar picante, totopos, jalapeños, salsa y guacamole.',
    'Beef mit Chili-Cheddar, Tortilla-Chips, Jalapeños, Salsa-Sauce und Guacamole.'], { picante: 1 });
  I('La Fresca', 11.5, ['Hamburguesa vegetal con lechuga, tomate, cebolla morada, pepinillo y mayonesa vegana en pan brioche vegano.',
    'Pflanzliches Patty mit Salat, Tomate, roten Zwiebeln, Gurken und veganer Mayonnaise im veganen Brioche-Bun.'], { vegano: true });
  I('Fuego Smash', 14.5, ['Ternera con queso pepper jack, bacon, aguacate, jalapeños, cebolla caramelizada y alioli de chipotle.',
    'Beef mit Pepper-Jack-Käse, Bacon, Avocado, Jalapeños, karamellisierten Zwiebeln und Chipotle-Aioli.'], { picante: 1 });

  C('extras');
  I(['Patatas de boniato', 'Süßkartoffelpommes'], 8, null, { vegano: true });
  I(['Patatas fritas', 'Pommes'], 6, null, { vegano: true });
  I('Guacamole', 4.5, null, { vegano: true });
  I(['Alioli de chipotle', 'Chipotle-Aioli'], 2.5, null);
  I('Salsa roja', 2.5, ['Salsa de tomate ahumada con chiles', 'Rauchige Tomatensalsa mit Chilis'], { picante: 1, vegano: true });
  I('Salsa verde', 2.5, ['Salsa de tomatillo con chile serrano', 'Würzige Tomatillo-Salsa mit Serrano'], { picante: 1, vegano: true });
  I('Mole negro', 4, ['Salsa con chocolate y chiles', 'Reichhaltige Sauce mit Schokolade und Chilis']); // precio leído de una foto borrosa: confirmar
  I('X-ni-pek', 2.2, ['Cebolla morada, vinagre, orégano y habanero', 'Rote Zwiebeln, Essig, Oregano, Habanero'], { picante: 3, vegano: true });
  I(['Tortillas (2 uds.)', 'Tortillas (2 Stk.)'], 2.9, ['De maíz o trigo, recién hechas', 'Frisch zubereitete Mais- oder Weizentortillas'], { vegano: true });
  I(['Tostadas (2 uds.)', 'Tostadas (2 Stk.)'], 2.9, null, { vegano: true });

  C('postres');
  I('Tres leches tiramisú', 7.5, ['Fusión del tiramisú italiano y el pastel tres leches mexicano.', 'Fusion aus italienischem Tiramisu und mexikanischem Tres-Leches-Kuchen.'], { veg: true });
  I('Churros con chocolate', 6.9, ['Churros crujientes con canela y azúcar y chocolate caliente para mojar.', 'Knusprige Teigstangen in Zimt und Zucker mit warmer Schokoladensauce zum Dippen.'], { veg: true });
  I('Flan de café', 6.9, ['Flan cremoso de café con caramelo salado, nibs de cacao y una bola de helado de galleta.', 'Cremiger Kaffee-Flan mit gesalzenem Karamell, Kakaonibs und einer Kugel Keks-Eis.'], { veg: true });
  I('Margarita sundae', 7.5, ['Selección de helados y sorbetes de frutas tropicales.', 'Auswahl an Eiscreme und tropischen Fruchtsorbets.'], { veg: true });

  // ---------------- BEBIDAS ----------------
  C('cocteles', ['Picantes y salados', 'Spicy & Savory']);
  I('El Presidente', 12.9, ['Tequila Patrón Silver, Tajín, zumo de pepino y lima. Fresco, chispeante y especiado.', 'Patrón Silver Tequila, Tajín, Gurkensaft, Limette. Kühl, spritzig und würzig.'], { picante: 1 });
  I('Don Diabla', 12.9, ['Mezcal, Cointreau, tamarindo, lima, Tabasco y chile en polvo. Ardiente y complejo.', 'Mezcal, Cointreau, Tamarinde, Limette, Tabasco, Chilipulver. Feurig-komplex.'], { picante: 2 });
  I('Mi Amor', 12.9, ['Tequila Cazadores Blanco, Aperol, puré de mango dulce y lima fresca.', 'Cazadores Blanco Tequila, Aperol, süßes Mangopüree und frische Limette.']);
  I('Cantarito', 12.9, ['Tequila Patrón Blanco, zumo de naranja y pomelo, chamoy, Tajín y lima fresca.', 'Patrón Blanco Tequila, Orangen- und Grapefruitsaft, Chamoy, Tajín und frische Limette.']);
  C('cocteles', ['Intensos', 'Bold & Boozy']);
  I('Basil Daiquiri', 10.9, ['Ron Havana Club, albahaca, lima y azúcar.', 'Havana Club Rum, Basilikum, Limette, Zucker.']);
  I('El Jefe', 12.9, ['Mezcal, marrasquino, chamoy, zumo de piña y lima. Energía de jefe en un vaso.', 'Mezcal, Maraschino, Chamoy, Ananassaft, Limette. Big Boss Energy im Glas.'], { destacado: true });
  I('El Rey del Sur', 11.9, ['Whisky de malta, miel, lima y sirope de jengibre. Un sour elegante.', 'Single Malt Whiskey, Honig, Limette, Ingwersirup. Ein eleganter, komplexer Sour.']);
  I('Alebrije', 12.9, ['Tequila Salitos, mezcal, Grand Marnier, arándano, piña, jamaica, coco y lima.', 'Salitos Tequila, Mezcal, Grand Marnier, Cranberry, Ananas, Jamaica, Kokos, Limette.']);
  C('cocteles', ['Dulces y únicos', 'Sweet & Unique']);
  I('Frida & Kahlo', 13.5, ['Tequila Patrón Silver, mezcal, zumo de melocotón y lima fresca. ¡Intenso, luminoso y dulce!', 'Patrón Silver Tequila, Mezcal, Pfirsichsaft und frische Limette. Bold, bright & sweet!'], { destacado: true });
  I('Oh, Señorita!', 11.9, ['Vodka, yuzu y puré de arándanos: elegante y afrutado.', 'Wodka, Yuzu und Blaubeerpüree – elegant und fruchtig.']);
  I('Flor del Sol', 12.9, ['Tequila Patrón Silver, zumo de lichi, sirope de hibisco y lima. Floral, dulce y elegante.', 'Patrón Silver Tequila, Lycheesaft, Hibiskussirup, Limettensaft. Blumig, süß, elegant.']);
  I('La Catrina', 11.9, ['Tequila Salitos Reposado, fresa natural y lima.', 'Salitos Tequila Reposado, frische Erdbeere und Limette.']);
  C('cocteles', ['Tropicales', 'Tropical & Exotic']);
  I('La Chicharita Spritz', 13.5, ['Vodka, chicha morada, licor de flor de saúco St-Germain y prosecco. Ligero y burbujeante.', 'Wodka, Chicha Morada, St-Germain Holunderblütenlikör, Prosecco. Light & fizzy.']);
  I('Cocolada', 12.9, ['Ron Bacardi, licor de coco, zumo de piña, Coco López y lima fresca.', 'Bacardi Rum, Kokoslikör, Ananassaft, Coco López und frische Limette.']);
  I('El Encanto', 11.9, ['Ginebra Bombay Sapphire, miel, maracuyá y lima fresca.', 'Bombay Sapphire Gin, Honig, Passionsfrucht und frische Limette.']);
  I('Tamarindo', 11.9, ['Tequila Salitos Silver, tamarindo, chamoy, Tajín y lima fresca.', 'Salitos Silver Tequila, Tamarinde, Chamoy, Tajín und frische Limette.'], { picante: 1 });

  C('margaritas', ['Margaritas', 'Margaritas']);
  I('Margarita', 12.5, ['Tequila blanco, Cointreau, zumo de lima y borde de sal.', 'Tequila Blanco, Cointreau, Limettensaft, Salzrand.'],
    { destacado: true, opciones_es: 'Clásica, maracuyá, fresa o mango', opciones_de: 'Classic, Maracuja, Erdbeere oder Mango' });
  I('Frozen Margarita', 12.9, ['Tequila blanco, Cointreau, zumo de lima y borde de sal, granizada.', 'Tequila Blanco, Cointreau, Limettensaft, Salzrand – frozen.'],
    { opciones_es: 'Fresa, mango o sandía', opciones_de: 'Erdbeere, Mango oder Wassermelone' });
  I(['Chile Cha-Cha (margarita picante)', 'Chile Cha-Cha Spicy Margarita'], 12.9, ['Tú eliges cuánto pica.', 'Du wählst die Schärfe.'],
    { picante: 2, opciones_es: 'Jalapeño, chipotle o habanero', opciones_de: 'Jalapeño, Chipotle oder Habanero' });
  C('margaritas', ['Sin alcohol', 'Mocktails']);
  I(['Margarita sin alcohol', 'Margarita alkoholfrei'], 9.9, ['Con alternativa al tequila sin alcohol.', 'Mit alkoholfreier Tequila-Alternative.'],
    { opciones_es: 'Clásica, maracuyá, fresa o mango', opciones_de: 'Classic, Maracuja, Erdbeere oder Mango' });
  I('La Norteña', 7.9, ['Alternativa al tequila sin alcohol, sirope de hibisco, jengibre y lima fresca.', 'Alkoholfreie Tequila-Alternative, Hibiskussirup, Ingwer, frische Limette.']);
  I('Virgin Colada', 7.9, ['Ron sin alcohol, zumo de piña, Coco López y lima fresca. ¡Cremoso!', 'Alkoholfreier Rum, Ananassaft, Coco López und frische Limette. Creamy & dreamy!']);
  I('Virgin Paloma', 7.9, ['Alternativa al tequila sin alcohol, soda de pomelo y lima fresca.', 'Alkoholfreie Tequila-Alternative, Grapefruit-Soda und frische Limette.']);
  I('Gin Fizz Claro', 7.9, ['Ginebra Tanqueray sin alcohol, zumo de limón, sirope y soda.', 'Tanqueray alkoholfreier Gin, Zitronensaft, Zuckersirup, Soda.']);
  I('The Lost Treasure', 8.9, ['Ron sin alcohol, piña, lima, granadina y ginger beer.', 'Alkoholfreier Rum, Ananassaft, Limettensaft, Grenadine und Ginger Beer.']);

  C('clasicos', ['Gin', 'Gin']);
  I('Negroni', 9.5, ['Ginebra Bombay Sapphire, Campari y vermut', 'Bombay Sapphire Gin, Campari, Wermut']);
  I('Gin & Tonic', 9.9, ['Ginebra Amalfi, tónica Goldberg y lima', 'Amalfi Gin, Goldberg Tonic, Limette']);
  I('The Classic Martini', 9.9, ['Ginebra Bombay Sapphire, vermut y aceitunas', 'Bombay Sapphire Gin, Wermut, Oliven']);
  I('Last Word', 11.9, ['Ginebra Bombay Sapphire, Chartreuse, marrasquino y lima', 'Bombay Sapphire Gin, Chartreuse, Maraschino, Limette']);
  I('Aviation', 11.9, ['Ginebra Monkey 47, marrasquino, crème de violette y limón', 'Monkey 47 Gin, Maraschino, Crème de Violette, Zitrone']);
  I("Bee's Knees", 9.9, ['Ginebra Bombay Sapphire, limón y sirope de miel', 'Bombay Sapphire Gin, Zitronensaft, Honigsirup']);
  I('Tom Collins', 8.8, ["Ginebra Gordon's, limón, sirope y soda", "Gordon's Gin, Zitronensaft, Zuckersirup, Soda"]);
  I("Bride's Mother", 11.9, ['Sloe gin, ginebra, zumo de pomelo y sirope', 'Sloe Gin, Gin, Grapefruitsaft, Zuckersirup']);
  I('Southside', 9.9, ['Ginebra Bombay Sapphire, lima, hierbabuena y sirope', 'Bombay Sapphire Gin, Limettensaft, Minze, Zuckersirup']);
  I('Clover Club', 10.9, ['Ginebra Beefeater, limón, sirope de frambuesa y clara de huevo', 'Beefeater Dry Gin, Zitronensaft, Himbeersirup, Eiweiß']);
  C('clasicos', ['Vodka', 'Vodka']);
  I('Moscow Mule', 9.9, ['Vodka Absolut, lima y ginger beer Goldberg', 'Absolut Vodka, Limette, Goldberg Ginger Beer']);
  I("The Dude's Delight", 9.9, ['Vodka 9 Mile, Kahlúa y nata', '9 Mile Vodka, Kahlúa, Sahne']);
  I('Porn Star Martini', 10.9, ['Vodka Absolut Vanilla, Passoã, lima, vainilla, maracuyá y prosecco', 'Absolut Vanilla Vodka, Passoã, Limette, Vanillesirup, Maracuja, Prosecco']);
  I('Espresso Martini', 10.9, ['Vodka Absolut, Kahlúa y espresso', 'Absolut Vodka, Kahlúa, Espresso']);
  I('Blue Monday', 10.9, ['Vodka 9 Mile, Cointreau y blue curaçao', '9 Mile Vodka, Cointreau, Blue Curaçao']);
  I('Cosmopolitan', 10.9, ['Vodka 9 Mile, triple seco, lima y arándano rojo', '9 Mile Vodka, Triple Sec, Limettensaft, Cranberrysaft']);
  I('Spotted Bikini', 11.9, ['Vodka, ron blanco, leche fría y limón', 'Vodka, weißer Rum, kalte Milch, Zitrone']);
  I('Mimi', 9.9, ['Vodka, crema de coco y zumo de piña', 'Vodka, Kokoscreme, Ananassaft']);
  C('clasicos', ['Ron y whiskey', 'Rum & Whiskey']);
  I('Mezcal-Rum Mai Tai', 11.9, ['Ron Bumbu, mezcal, licor de naranja, orgeat y lima', 'Bumbu Dark Rum, Mezcal, Orangenlikör, Orgeat-Sirup, Limettensaft']);
  I('Piña con Chile Mojito', 10.9, ['Bacardi Carta Blanca, piña, lima, hierbabuena, chile de árbol y soda', 'Bacardi Carta Blanca, Ananassaft, Limette, Minze, Chile de Árbol, Soda'], { picante: 1 });
  I('Strawberry Colada', 11.9, ['Bacardi Carta Blanca, piña, crema de coco y fresa', 'Bacardi Carta Blanca, Ananassaft, Kokoscreme, Erdbeere']);
  I('Oaxacan Old Fashioned', 11.9, ['Whiskey, mezcal, sirope de agave, bitter de mole y piel de naranja', 'Whiskey, Mezcal, Agavensirup, Mole-Bitters, Orangenschale']);
  I('Tamarind Whiskey Sour', 10.9, ['Whiskey, sirope de tamarindo, lima, clara de huevo y Tajín', 'Whiskey, Tamarindensirup, Limettensaft, Eiweiß, Tajín']);
  I('Mexican Boulevardier', 12.9, ['Whiskey, Campari, vermut dulce, mezcal y naranja', 'Whiskey, Campari, süßer Wermut, Mezcal, Orange']);

  C('spritz', ['Spritz', 'Spritz']);
  I('Aperol Spritz', 7.9, ['Aperol, prosecco, soda y naranja', 'Aperol, Prosecco, Soda, Orangenscheibe']);
  I('Limoncello Spritz', 7.9, ['Limoncello, prosecco, soda y limón', 'Limoncello, Prosecco, Soda, Zitronenscheibe']);
  I('Campari Spritz', 7.9, ['Campari, prosecco, soda y naranja', 'Campari, Prosecco, Soda, Orangenscheibe']);
  I('Sarti Spritz', 7.9, ['Sarti, prosecco, soda y lima', 'Sarti, Prosecco, Soda, Limettenscheibe']);
  I(['Crodino Spritz sin alcohol', 'Crodino Spritz alkoholfrei'], 7.5, ['Crodino, prosecco, soda y naranja', 'Crodino, Prosecco, Soda, Orangenscheibe']);
  C('spritz', ['Aperitivos', 'Aperitif']);
  I('Lillet Berry', 7.9, ['Lillet Blanc, Goldberg Wild Berry y frutos rojos', 'Lillet Blanc, Goldberg Wild Berry, Beeren']);
  I('Lillet Peach', 7.9, ['Lillet Rosé, Schweppes White Peach y melocotón', 'Lillet Rosé, Schweppes White Peach, Pfirsich']);
  I('Paloma', 7.9, ['Tequila, lima y refresco de pomelo', 'Tequila, Limette & Grapefruit-Limonade']);
  I('Hugo', 7.9, ['Prosecco, sirope de flor de saúco, soda, hierbabuena y lima', 'Prosecco, Holunderblütensirup, Soda, Minze, Limette']);
  I(['Campari con soda o naranja', 'Campari Soda/Orange'], 7.9, null);
  I('Martini Bianco 5 cl', 5.5, null);

  C('shots', ['Tequila (2 cl)', 'Tequila (2 cl)']);
  [['Azul Reposado', 16.5], ['Patrón Silver', 4.9], ['Patrón Añejo', 4.9], ['Patrón XO Café', 4.9], ['Don Julio Blanco', 4.9],
    ['Don Julio Reposado', 4.9], ['Don Julio Añejo', 5.2], ['José Cuervo 1800 Silver', 3.9], ['José Cuervo 1800 Reposado', 3.9],
    ['Salitos Silver', 3.5], ['Salitos Gold', 3.5], ['Salitos Reposado', 3.5], ['Cazadores Blanco', 3.9], ['Cazadores Reposado', 3.9],
    ['Herradura Reposado', 4.9], ['Corralejo Reposado', 4.5], ['Casamigos Añejo', 4.9], ['Teremana Blanco', 4.2], ['Teremana Reposado', 4.2],
  ].forEach(([n, p]) => I(n, p, null));
  C('shots', ['Mezcal (2 cl)', 'Mezcal (2 cl)']);
  I('400 Conejos (38 %)', 4.5, null);
  I('San Cosme (40 %)', 4.5, null);
  C('shots', ['Licores', 'Liköre']);
  [['Averna Amaro 4 cl', 5.5], ['Ramazzotti 4 cl', 5.5], ['Jägermeister 2 cl', 3.5], ['Sambuca 2 cl', 3.9], ['Fernet-Branca 4 cl', 5.5]].forEach(([n, p]) => I(n, p, null));
  C('shots', ['Whiskey (4 cl)', 'Whiskey (4 cl)']);
  [['Jameson', 5.5], ['Bushmills Original', 5.5], ["Jack Daniel's", 6.5], ['The Glenlivet 12', 7.5], ['The Macallan Double Cask 12', 11.9]].forEach(([n, p]) => I(n, p, null));

  C('cervezas');
  I(['Löwenbrauerei Helles 0,5 l', 'Löwenbrauerei Helles 0,5 l'], 4.7, ['Cerveza de Passau', 'Aus Passau']);
  I('Löwenbrauerei Weizen 0,5 l', 4.9, null, { opciones_es: 'Clara, sin alcohol u oscura', opciones_de: 'Hell, alkoholfrei oder dunkel' });
  I('Löwenbrauerei Radler 0,5 l', 4.7, null);
  I(['Löwenbrauerei Hell sin alcohol 0,5 l', 'Löwenbrauerei Hell alkoholfrei 0,5 l'], 4.7, null);
  I('Cola-Weizen 0,5 l', 5.2, null);
  I('Corona Extra 0,33 l', 4.9, null);
  I('Corona Cero 0,33 l', 4.9, null);
  I('Salitos Original 0,33 l', 4.9, null);
  I('Salitos Ice 0,33 l', 4.9, null);
  I('San Miguel 0,3 l', 5.5, null);

  C('vinos', ['Blancos (1/8 l)', 'Weißweine (1/8 l)']);
  I('Chardonnay 2024', 4.8, ['Seegut Lentsch, Neusiedlersee', 'Seegut Lentsch, Neusiedlersee']);
  I('Lugana Oro Blue 2024', 4.8, ['Tenuta Malavasi, Lombardía', 'Tenuta Malavasi, Lombardei']);
  I(['Pinot blanco semiseco 2024', 'Weißburgunder feinherb 2024'], 4.8, ['Weingut Trenz, Rheingau', 'Weingut Trenz, Rheingau']);
  C('vinos', ['Tintos (1/8 l)', 'Rotweine (1/8 l)']);
  I("Primitivo Chiave d'Oro 2023", 4.8, ['Tenuta Lonis, Apulia', 'Tenuta Lonis, Apulien']);
  I('Rioja Crianza 2021', 4.8, ['Señorío de Lanciego, Rioja', 'Señorío de Lanciego, Rioja']);
  I('Purple 2022', 5.2, ['Zweigelt, Blaufränkisch y Merlot – Markowitsch, Carnuntum', 'Zweigelt, Blaufränkisch, Merlot – Markowitsch, Carnuntum']);
  C('vinos', ['Rosado, prosecco y más', 'Rosé, Prosecco & mehr']);
  I(['Rosé Cuvée semiseco 2024', 'Rosé Cuvée halbtrocken 2024'], 4.8, ['Seegut Lentsch, Neusiedlersee', 'Seegut Lentsch, Neusiedlersee'],
    { variantes: [V('Copa 1/8 l', 'Glas 1/8 l', 4.8), V('Botella 0,75 l', 'Flasche 0,75 l', 29)] });
  I('Prosecco Scavi & Ray', 7.9, ['Prosecco spumante', 'Prosecco Spumante'],
    { variantes: [V('Benjamín 0,2 l', 'Piccolo 0,2 l', 7.9), V('Botella 0,75 l', 'Flasche 0,75 l', 24.5)] });
  I(['Vino con gaseosa 0,2 l', 'Weinschorle 0,2 l'], 4.9, null, { opciones_es: 'Blanco o tinto', opciones_de: 'Weiß oder rot' });

  C('refrescos', ['Refrescos', 'Softgetränke']);
  I(['Vio con o sin gas 0,25 l', 'Vio spritzig/still 0,25 l'], 3.5, null);
  I('Coca-Cola 0,33 l', 4.2, null, { opciones_es: 'Clásica, light o zero', opciones_de: 'Klassisch, Light oder Zero' });
  I('Fanta / Sprite 0,33 l', 4.2, null);
  I('Cola-Mix 0,5 l', 4.5, null);
  I(['Agua de mesa 0,5 l', 'Tafelwasser 0,5 l'], 3.2, null);
  I('Red Bull 0,25 l', 4.9, null, { opciones_es: 'Original, sin azúcar o coco-arándano', opciones_de: 'Original, Sugarfree oder Kokos-Blaubeere' });
  I('Goldberg 0,2 l', 3.9, null, { opciones_es: 'Tónica, ginger ale, bitter lemon o wild berry', opciones_de: 'Tonic, Ginger Ale, Bitter Lemon oder Wild Berry' });
  I('Jarritos 0,37 l', 4.2, null, { opciones_es: 'Guayaba, lima o piña', opciones_de: 'Guave, Limette oder Ananas' });
  I(['Soda con limón 0,4 l', 'Soda Zitrone 0,4 l'], 3.9, null);
  I(['Zumo o zumo con soda 0,2 l', 'Saft und Schorle 0,2 l'], 3.6, null,
    { opciones_es: 'Manzana, naranja, grosella, ruibarbo, maracuyá, mango o saúco', opciones_de: 'Apfel, Orange, Johannisbeere, Rhabarber, Maracuja, Mango oder Holunder' });
  C('refrescos', ['Café y té', 'Kaffee & Tee']);
  I('Espresso', 2.9, null);
  I('Espresso doppio', 3.9, null);
  I('Café crema', 4.2, null);
  I('Cappuccino', 4.2, null);
  I(['Té', 'Tee'], 3.9, null, { opciones_es: 'Menta, manzanilla, frutas, negro o verde', opciones_de: 'Pfefferminz, Kamille, Früchte, Schwarz oder Grün' });

  CE.demo = {
    ajustes: {
      nombre: 'Cantina Ensenada',
      eslogan_es: 'Cocina mexicana & tequila bar',
      eslogan_de: 'Cocina Mexicana & Tequila Bar',
      direccion: 'Löwengrube 4',
      cp_ciudad: '94032 Passau',
      telefono: '+49 176 62011209',
      email: '',
      instagram: 'cantinaensenada_passau',
      reserva_url: 'https://www.thefork.de/restaurant/cantina-ensenada-r850664',
      maps_url: 'https://www.google.com/maps/search/?api=1&query=Cantina%20Ensenada%2C%20L%C3%B6wengrube%204%2C%2094032%20Passau&query_place_id=ChIJW577GqtYdEcRtKUyvOm_6pk',
      // Notas en otras webs (solo datos reales; nota vacía = se muestra sin cifra)
      valoraciones: [
        { fuente: 'TheFork', nota: '9,0', escala: '10', opiniones: '197', url: 'https://www.thefork.de/restaurant/cantina-ensenada-r850664' },
        { fuente: 'Google', nota: null, escala: '5', opiniones: '500+', url: 'https://www.google.com/maps/search/?api=1&query=Cantina%20Ensenada%2C%20L%C3%B6wengrube%204%2C%2094032%20Passau&query_place_id=ChIJW577GqtYdEcRtKUyvOm_6pk' },
      ],
      // Horario por día de la semana (0 = domingo … 6 = sábado): [abre, cierra] o null si cierra.
      // "24:00" = medianoche; si cierra después de medianoche, p. ej. "01:00", también vale.
      horario: [['17:00', '23:00'], null, ['17:00', '24:00'], ['17:00', '24:00'], ['17:00', '24:00'], ['17:00', '24:00'], ['17:00', '24:00']],
      cara_jefe: null, // URL de la foto del dueño. null = jefe dibujado
      promo_ruleta_es: null, promo_ruleta_de: null,
    },
    categorias: [
      { id: 'tacos', grupo: 'comida', icono: '🌮', nombre_es: 'Tacos', nombre_de: 'Tacos' },
      { id: 'entrantes', grupo: 'comida', icono: '🌽', nombre_es: 'Para empezar', nombre_de: 'Vorspeisen' },
      { id: 'platos', grupo: 'comida', icono: '🔥', nombre_es: 'Platos fuertes', nombre_de: 'Hauptgerichte' },
      { id: 'burger', grupo: 'comida', icono: '🍔', nombre_es: 'Burgers', nombre_de: 'Burger',
        nota_es: 'Todas en pan brioche tostado.', nota_de: 'Alle im gerösteten Brioche-Bun.' },
      { id: 'ensaladas', grupo: 'comida', icono: '🥗', nombre_es: 'Ensaladas y sopas', nombre_de: 'Salate & Suppen',
        nota_es: 'Elige tu aliño: miel y lima casero · chipotle ranch ahumado · yogur y hierbas.',
        nota_de: 'Wähle dein Dressing: hausgemachtes Honig-Limetten · rauchiges Chipotle-Ranch · Joghurt-Kräuter.' },
      { id: 'extras', grupo: 'comida', icono: '🥑', nombre_es: 'Dips y guarniciones', nombre_de: 'Dips & Beilagen', lista: true },
      { id: 'postres', grupo: 'comida', icono: '🍮', nombre_es: 'Postres', nombre_de: 'Desserts' },
      { id: 'cocteles', grupo: 'bebida', icono: '🍹', nombre_es: 'Cócteles de la casa', nombre_de: 'Handcrafted Cocktails' },
      { id: 'margaritas', grupo: 'bebida', icono: '🍸', nombre_es: 'Margaritas y sin alcohol', nombre_de: 'Margaritas & Mocktails' },
      { id: 'shots', grupo: 'bebida', icono: '🌵', nombre_es: 'Tequila, mezcal y chupitos', nombre_de: 'Tequila, Mezcal & Shots', lista: true },
      { id: 'clasicos', grupo: 'bebida', icono: '🥃', nombre_es: 'Clásicos', nombre_de: 'Klassiker' },
      { id: 'spritz', grupo: 'bebida', icono: '🍊', nombre_es: 'Spritz y aperitivos', nombre_de: 'Spritz & Aperitif' },
      { id: 'cervezas', grupo: 'bebida', icono: '🍺', nombre_es: 'Cervezas', nombre_de: 'Bier', lista: true },
      { id: 'vinos', grupo: 'bebida', icono: '🍷', nombre_es: 'Vinos y prosecco', nombre_de: 'Wein & Prosecco', lista: true },
      { id: 'refrescos', grupo: 'bebida', icono: '☕', nombre_es: 'Refrescos y café', nombre_de: 'Softdrinks & Kaffee', lista: true },
    ],
    platos,
    // Hall of Fame: extractos literales de reseñas reales de Google (octubre 2026, vía reviewhero.io).
    // Nombre de pila + inicial. El restaurante puede cambiarlas desde el panel.
    opiniones: [
      { autor: 'Thomas S.', fuente: 'Google', fecha: '2026-10-07', idioma: 'de', foto: 'assets/fotos/barra-catrina.webp',
        texto_de: 'Die Burritos waren die besten, welche wir seit 25 Jahren außerhalb Mexikos gegessen haben!!!',
        texto_es: 'Los burritos eran los mejores que hemos comido fuera de México en 25 años.' },
      { autor: 'Aravind', fuente: 'Google', fecha: '2026-10-07', idioma: 'en', foto: 'assets/fotos/comedor-sombreros.webp',
        texto_es: 'Buena comida, buena gente, buen rollo.', texto_de: 'Gutes Essen, gute Leute, gute Stimmung.', texto_original: 'good food, good people, good vibes' },
      { autor: 'Sreeja M.', fuente: 'Google', fecha: '2026-09-22', idioma: 'en', foto: 'assets/fotos/tacos-baja.webp',
        texto_es: 'Los tacos y las hamburguesas estaban deliciosos, y los cócteles también muy buenos.', texto_de: 'Die Tacos und Burger waren köstlich und die Cocktails auch richtig gut.',
        texto_original: 'The tacos and burgers were delicious, and the cocktails were really good too.' },
      { autor: 'Nithya P.', fuente: 'Google', fecha: '2026-09-23', idioma: 'de', foto: 'assets/fotos/comedor-velas.webp',
        texto_de: 'Wirklich tolles Essen und ein ausgezeichneter Service!', texto_es: '¡Comida realmente buenísima y un servicio excelente!' },
      { autor: 'Cheryl B.', fuente: 'Google', fecha: '2026-09-26', idioma: 'en', foto: 'assets/fotos/steak.webp',
        texto_es: 'La comida, una delicia, y las bebidas muy buenas.', texto_de: 'Das Essen war herrlich und die Drinks sehr gut.', texto_original: 'Food was delightful and drinks very good.' },
      { autor: 'Florent H.', fuente: 'Google', fecha: '2026-09-22', idioma: 'de', foto: 'assets/fotos/tacos-baja.webp',
        texto_de: 'Alles war sehr gut und das Essen war perfekt.', texto_es: 'Todo estaba muy bueno y la comida, perfecta.' },
    ],
    fotos: [
      { url: 'assets/fotos/barra-catrina.webp', texto_es: 'La barra y nuestra catrina', texto_de: 'Die Bar und unsere Catrina', ancho: 2 },
      { url: 'assets/fotos/tacos-baja.webp', texto_es: 'Tacos de pescado estilo Baja', texto_de: 'Baja-Style Fish Tacos' },
      { url: 'assets/fotos/comedor-sombreros.webp', texto_es: 'Bajo la bóveda', texto_de: 'Unter dem Gewölbe' },
      { url: 'assets/fotos/steak.webp', texto_es: 'Para los de buen comer', texto_de: 'Für den großen Hunger' },
      { url: 'assets/fotos/comedor-velas.webp', texto_es: 'Cenas a la luz de las velas', texto_de: 'Abendessen bei Kerzenlicht' },
    ],
  };
})();
