import type { Word, Connector, QuickTapContext, SuffixChip } from '../types/spanish'

function seedId(prefix: string, index: number): string {
  return `seed_${prefix}_${index}`
}

export const SEED_WORDS: Word[] = [
  // ── GREETINGS & BASICS ──────────────────────────────────────────────────
  { id: seedId('greet', 0),  english: 'Hello',                    spanish: 'Hola',                      pronunciation: 'OH-la',                          category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 1),  english: 'Goodbye',                  spanish: 'Adiós',                     pronunciation: 'ah-DYOS',                        category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 2),  english: 'Please',                   spanish: 'Por favor',                 pronunciation: 'por fa-VOR',                     category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 3),  english: 'Thank you',                spanish: 'Gracias',                   pronunciation: 'GRA-thyahs',                     category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 4),  english: "You're welcome",           spanish: 'De nada',                   pronunciation: 'de NA-da',                       category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 5),  english: 'Yes',                      spanish: 'Sí',                        pronunciation: 'see',                            category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 6),  english: 'No',                       spanish: 'No',                        pronunciation: 'no',                             category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 7),  english: 'Excuse me',                spanish: 'Perdona',                   pronunciation: 'per-DOH-na',                     category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 8),  english: 'Sorry',                    spanish: 'Lo siento',                 pronunciation: 'lo SYEN-to',                     category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 9),  english: 'Good morning',             spanish: 'Buenos días',               pronunciation: 'BWAY-nos DEE-as',                category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 10), english: 'Good afternoon',           spanish: 'Buenas tardes',             pronunciation: 'BWAY-nas TAR-des',               category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 11), english: 'Good evening',             spanish: 'Buenas noches',             pronunciation: 'BWAY-nas NO-ches',               category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 12), english: "I don't understand",       spanish: 'No entiendo',               pronunciation: 'no en-TYEN-do',                  category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 13), english: 'Do you speak English?',    spanish: '¿Hablas inglés?',           pronunciation: 'AB-las een-GLES',                category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 14), english: 'My name is',               spanish: 'Me llamo',                  pronunciation: 'me YA-mo',                       category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 15), english: 'How are you?',             spanish: '¿Cómo estás?',              pronunciation: 'KO-mo es-TAS',                   category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 16), english: 'Very well, thanks',        spanish: 'Muy bien, gracias',         pronunciation: 'MOO-ee BYEN GRA-thyahs',         category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 17), english: 'See you later',            spanish: 'Hasta luego',               pronunciation: 'AS-ta LWEH-go',                  category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 18), english: 'See you tomorrow',         spanish: 'Hasta mañana',              pronunciation: 'AS-ta ma-NYA-na',                category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 19), english: 'Good luck',                spanish: 'Buena suerte',              pronunciation: 'BWAY-na SWER-te',                category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 20), english: 'Nice to meet you',         spanish: 'Mucho gusto',               pronunciation: 'MOO-cho GOOS-to',                category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 21), english: 'Please speak slowly',      spanish: 'Habla más despacio',        pronunciation: 'AB-la mas des-PA-thyo',          category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 22), english: 'Can you repeat that?',     spanish: '¿Puedes repetir?',          pronunciation: 'PWAY-des re-pe-TEER',            category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 23), english: 'I speak a little Spanish', spanish: 'Hablo un poco de español',  pronunciation: 'AB-lo oon PO-ko de es-pa-NYOL', category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 24), english: 'Of course',                spanish: 'Por supuesto',              pronunciation: 'por soo-PWES-to',                category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 25), english: 'No problem',               spanish: 'No hay problema',           pronunciation: 'no AY pro-BLE-ma',               category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 26), english: 'I agree',                  spanish: 'De acuerdo',                pronunciation: 'de ah-KWER-do',                  category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('greet', 27), english: 'Wait a moment',            spanish: 'Un momento',                pronunciation: 'oon mo-MEN-to',                  category: 'greetings', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },

  // ── IN A CAFÉ ────────────────────────────────────────────────────────────
  { id: seedId('cafe', 0),  english: 'Coffee',                    spanish: 'Café',                      pronunciation: 'ka-FE',                          category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 1),  english: 'Tea',                       spanish: 'Té',                        pronunciation: 'te',                             category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 2),  english: 'Milk',                      spanish: 'Leche',                     pronunciation: 'LE-che',                         category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 3),  english: 'Orange juice',              spanish: 'Zumo de naranja',           pronunciation: 'THOO-mo de na-RAN-ha',           category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 4),  english: 'Hot chocolate',             spanish: 'Chocolate caliente',        pronunciation: 'cho-ko-LA-te ka-LYEN-te',        category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 5),  english: 'White coffee',              spanish: 'Café con leche',            pronunciation: 'ka-FE kon LE-che',               category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 6),  english: 'Espresso',                  spanish: 'Café solo',                 pronunciation: 'ka-FE SO-lo',                    category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 7),  english: 'Cortado',                   spanish: 'Cortado',                   pronunciation: 'kor-TA-do',                      category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 8),  english: 'Decaf',                     spanish: 'Descafeinado',              pronunciation: 'des-ka-fe-ee-NA-do',             category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 9),  english: 'Sugar',                     spanish: 'Azúcar',                    pronunciation: 'ah-THOO-kar',                    category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 10), english: 'Still water',               spanish: 'Agua sin gas',              pronunciation: 'AH-gwa seen gas',               category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 11), english: 'Sparkling water',           spanish: 'Agua con gas',              pronunciation: 'AH-gwa kon gas',                category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 12), english: 'Toast',                     spanish: 'Tostada',                   pronunciation: 'tos-TA-da',                      category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 13), english: 'Croissant',                 spanish: 'Cruasán',                   pronunciation: 'krwa-SAN',                       category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 14), english: 'Pastry',                    spanish: 'Bollo',                     pronunciation: 'BO-yo',                          category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 15), english: 'Sandwich',                  spanish: 'Bocadillo',                 pronunciation: 'bo-ka-DEE-yo',                   category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 16), english: 'For here',                  spanish: 'Para tomar aquí',           pronunciation: 'PA-ra to-MAR ah-KEE',            category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 17), english: 'To go',                     spanish: 'Para llevar',               pronunciation: 'PA-ra ye-VAR',                   category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 18), english: 'No ice',                    spanish: 'Sin hielo',                 pronunciation: 'seen YE-lo',                     category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 19), english: 'The same again',            spanish: 'Lo mismo',                  pronunciation: 'lo MEES-mo',                     category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 20), english: 'Outdoor seating',           spanish: 'Terraza',                   pronunciation: 'te-RA-tha',                      category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 21), english: 'WiFi password',             spanish: 'Contraseña del WiFi',       pronunciation: 'kon-tra-SE-nya del WEE-fee',     category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 22), english: 'The bill',                  spanish: 'La cuenta',                 pronunciation: 'la KWEN-ta',                     category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 23), english: 'Breakfast',                 spanish: 'Desayuno',                  pronunciation: 'de-sa-YOO-no',                   category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 24), english: 'A glass of',                spanish: 'Un vaso de',                pronunciation: 'oon VA-so de',                   category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('cafe', 25), english: 'Ice cream',                 spanish: 'Helado',                    pronunciation: 'e-LA-do',                        category: 'cafe', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },

  // ── IN A RESTAURANT ──────────────────────────────────────────────────────
  { id: seedId('rest', 0),  english: 'The menu',                  spanish: 'La carta',                  pronunciation: 'la KAR-ta',                      category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 1),  english: "Today's set menu",          spanish: 'El menú del día',           pronunciation: 'el me-NOO del DEE-a',            category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 2),  english: 'A table for',               spanish: 'Una mesa para',             pronunciation: 'OO-na ME-sa PA-ra',              category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 3),  english: 'Waiter',                    spanish: 'Camarero',                  pronunciation: 'ka-ma-RE-ro',                    category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 4),  english: 'The bill',                  spanish: 'La cuenta',                 pronunciation: 'la KWEN-ta',                     category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 5),  english: 'Water',                     spanish: 'Agua',                      pronunciation: 'AH-gwa',                         category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 6),  english: 'Wine',                      spanish: 'Vino',                      pronunciation: 'VEE-no',                         category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 7),  english: 'Beer',                      spanish: 'Cerveza',                   pronunciation: 'ther-VE-tha',                    category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 8),  english: 'Red wine',                  spanish: 'Vino tinto',                pronunciation: 'VEE-no TEEN-to',                 category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 9),  english: 'White wine',                spanish: 'Vino blanco',               pronunciation: 'VEE-no BLAN-ko',                 category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 10), english: 'House wine',                spanish: 'Vino de la casa',           pronunciation: 'VEE-no de la KA-sa',             category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 11), english: 'A bottle of',               spanish: 'Una botella de',            pronunciation: 'OO-na bo-TE-ya de',              category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 12), english: 'Starter',                   spanish: 'Entrante',                  pronunciation: 'en-TRAN-te',                     category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 13), english: 'Main course',               spanish: 'Plato principal',           pronunciation: 'PLA-to preen-thee-PAL',          category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 14), english: 'Dessert',                   spanish: 'Postre',                    pronunciation: 'POS-tre',                        category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 15), english: 'Fish',                      spanish: 'Pescado',                   pronunciation: 'pes-KA-do',                      category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 16), english: 'Chicken',                   spanish: 'Pollo',                     pronunciation: 'PO-yo',                          category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 17), english: 'Meat',                      spanish: 'Carne',                     pronunciation: 'KAR-ne',                         category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 18), english: 'Salad',                     spanish: 'Ensalada',                  pronunciation: 'en-sa-LA-da',                    category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 19), english: 'Bread',                     spanish: 'Pan',                       pronunciation: 'pan',                            category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 20), english: 'Cheese',                    spanish: 'Queso',                     pronunciation: 'KE-so',                          category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 21), english: 'Ham',                       spanish: 'Jamón',                     pronunciation: 'ha-MON',                         category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 22), english: 'Tomato',                    spanish: 'Tomate',                    pronunciation: 'to-MA-te',                       category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 23), english: "I'm vegetarian",            spanish: 'Soy vegetariano',           pronunciation: 'soy ve-he-ta-RYA-no',            category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 24), english: 'Gluten free',               spanish: 'Sin gluten',                pronunciation: 'seen GLOO-ten',                  category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 25), english: 'Without',                   spanish: 'Sin',                       pronunciation: 'seen',                           category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 26), english: 'Some more',                 spanish: 'Un poco más',               pronunciation: 'oon PO-ko mas',                  category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 27), english: 'Delicious',                 spanish: 'Delicioso',                 pronunciation: 'de-li-THYOH-so',                 category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 28), english: 'It was delicious',          spanish: 'Estaba delicioso',          pronunciation: 'es-TA-ba de-li-THYOH-so',        category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 29), english: "I'm full",                  spanish: 'Estoy lleno',               pronunciation: 'es-TOY YE-no',                   category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 30), english: 'A portion of',              spanish: 'Una ración de',             pronunciation: 'OO-na ra-THYON de',              category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 31), english: 'Napkins',                   spanish: 'Servilletas',               pronunciation: 'ser-vee-YE-tas',                 category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 32), english: 'Fork',                      spanish: 'Tenedor',                   pronunciation: 'te-ne-DOR',                      category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 33), english: 'Knife',                     spanish: 'Cuchillo',                  pronunciation: 'koo-CHEE-yo',                    category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 34), english: 'Spoon',                     spanish: 'Cuchara',                   pronunciation: 'koo-CHA-ra',                     category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 35), english: 'Lunch',                     spanish: 'Almuerzo',                  pronunciation: 'al-MWER-tho',                    category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 36), english: 'Dinner',                    spanish: 'Cena',                      pronunciation: 'THE-na',                         category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 37), english: 'What do you recommend?',    spanish: '¿Qué recomienda?',          pronunciation: 'ke re-ko-MYEN-da',               category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 38), english: 'Is this spicy?',            spanish: '¿Es picante?',              pronunciation: 'es pee-KAN-te',                  category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 39), english: 'Allergic to',               spanish: 'Alérgico a',                pronunciation: 'ah-LER-hee-ko ah',               category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 40), english: 'Rare',                      spanish: 'Poco hecho',                pronunciation: 'PO-ko E-cho',                    category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('rest', 41), english: 'Well done',                 spanish: 'Muy hecho',                 pronunciation: 'MOO-ee E-cho',                   category: 'restaurant', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },

  // ── IN A SHOP ────────────────────────────────────────────────────────────
  { id: seedId('shop', 0),  english: 'How much?',                 spanish: 'Cuánto cuesta',             pronunciation: 'KWAN-to KWES-ta',                category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 1),  english: 'Expensive',                 spanish: 'Caro',                      pronunciation: 'KA-ro',                          category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 2),  english: 'Cheap',                     spanish: 'Barato',                    pronunciation: 'ba-RA-to',                       category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 3),  english: 'Do you have',               spanish: 'Tiene',                     pronunciation: 'TYE-ne',                         category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 4),  english: "I'm looking for",           spanish: 'Estoy buscando',            pronunciation: 'es-TOY boos-KAN-do',             category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 5),  english: 'Can I pay by card?',        spanish: '¿Puedo pagar con tarjeta?', pronunciation: 'PWAY-do pa-GAR kon tar-HE-ta',   category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 6),  english: 'Cash',                      spanish: 'Efectivo',                  pronunciation: 'e-fek-TEE-vo',                   category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 7),  english: 'Receipt',                   spanish: 'Recibo',                    pronunciation: 're-THEE-bo',                     category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 8),  english: 'A bag',                     spanish: 'Una bolsa',                 pronunciation: 'OO-na BOL-sa',                   category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 9),  english: 'Change (money)',            spanish: 'Cambio',                    pronunciation: 'KAM-byo',                        category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 10), english: 'Discount',                  spanish: 'Descuento',                 pronunciation: 'des-KWEN-to',                    category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 11), english: 'Sale',                      spanish: 'Rebajas',                   pronunciation: 're-BA-has',                      category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 12), english: 'Supermarket',               spanish: 'Supermercado',              pronunciation: 'soo-per-mer-KA-do',              category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 13), english: 'Market',                    spanish: 'Mercado',                   pronunciation: 'mer-KA-do',                      category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 14), english: 'Open',                      spanish: 'Abierto',                   pronunciation: 'ah-BYER-to',                     category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 15), english: 'Closed',                    spanish: 'Cerrado',                   pronunciation: 'the-RRA-do',                     category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 16), english: 'Crisps',                    spanish: 'Patatas fritas',            pronunciation: 'pa-TA-tas FREE-tas',             category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 17), english: 'Sweets',                    spanish: 'Chuches',                   pronunciation: 'CHOO-ches',                      category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 18), english: 'Chocolate',                 spanish: 'Chocolate',                 pronunciation: 'cho-ko-LA-te',                   category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 19), english: 'Chewing gum',               spanish: 'Chicle',                    pronunciation: 'CHEE-kle',                       category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 20), english: 'Sun cream',                 spanish: 'Crema solar',               pronunciation: 'KRE-ma so-LAR',                  category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 21), english: 'Size',                      spanish: 'Talla',                     pronunciation: 'TA-ya',                          category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 22), english: 'Too big',                   spanish: 'Demasiado grande',          pronunciation: 'de-ma-SYAH-do GRAN-de',          category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 23), english: 'Too small',                 spanish: 'Demasiado pequeño',         pronunciation: 'de-ma-SYAH-do pe-KE-nyo',        category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('shop', 24), english: 'Fitting room',              spanish: 'Probador',                  pronunciation: 'pro-ba-DOR',                     category: 'shop', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },

  // ── IN A HOTEL ───────────────────────────────────────────────────────────
  { id: seedId('hotel', 0),  english: 'Reservation',              spanish: 'Reserva',                   pronunciation: 're-SER-va',                      category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 1),  english: 'Room',                     spanish: 'Habitación',                pronunciation: 'ah-bee-ta-THYON',               category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 2),  english: 'Check-out time',           spanish: 'Hora de salida',            pronunciation: 'OH-ra de sa-LEE-da',             category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 3),  english: 'Key',                      spanish: 'Llave',                     pronunciation: 'YA-ve',                          category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 4),  english: 'Towels',                   spanish: 'Toallas',                   pronunciation: 'to-AH-yas',                      category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 5),  english: 'More towels',              spanish: 'Más toallas',               pronunciation: 'mas to-AH-yas',                  category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 6),  english: 'Swimming pool',            spanish: 'Piscina',                   pronunciation: 'pees-THEE-na',                   category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 7),  english: 'Breakfast included',       spanish: 'Desayuno incluido',         pronunciation: 'de-sa-YOO-no een-kloo-EE-do',   category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 8),  english: 'Air conditioning',         spanish: 'Aire acondicionado',        pronunciation: 'AY-re ah-kon-dee-thyo-NA-do',   category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 9),  english: 'WiFi password',            spanish: 'Contraseña del WiFi',       pronunciation: 'kon-tra-SE-nya del WEE-fee',     category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 10), english: 'Check-in',                 spanish: 'Registro',                  pronunciation: 're-HEES-tro',                    category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 11), english: 'Lift / Elevator',          spanish: 'Ascensor',                  pronunciation: 'as-then-SOR',                    category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 12), english: 'Reception',                spanish: 'Recepción',                 pronunciation: 're-thep-THYON',                  category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 13), english: 'Car park',                 spanish: 'Aparcamiento',              pronunciation: 'ah-par-ka-MYEN-to',              category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 14), english: 'Single room',              spanish: 'Habitación individual',     pronunciation: 'ah-bee-ta-THYON een-dee-vee-DWAL', category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 15), english: 'Double room',              spanish: 'Habitación doble',          pronunciation: 'ah-bee-ta-THYON DOH-ble',        category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 16), english: 'Floor (storey)',           spanish: 'Planta',                    pronunciation: 'PLAN-ta',                        category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 17), english: 'I have a problem',         spanish: 'Tengo un problema',         pronunciation: 'TEN-go oon pro-BLE-ma',          category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 18), english: 'Do not disturb',           spanish: 'No molestar',               pronunciation: 'no mo-les-TAR',                  category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 19), english: 'Safe (box)',               spanish: 'Caja fuerte',               pronunciation: 'KA-ha FWER-te',                  category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 20), english: 'More pillows',             spanish: 'Más almohadas',             pronunciation: 'mas al-mo-AH-das',               category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('hotel', 21), english: 'Wake-up call',             spanish: 'Despertador',               pronunciation: 'des-per-ta-DOR',                 category: 'hotel', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },

  // ── GETTING AROUND ───────────────────────────────────────────────────────
  { id: seedId('travel', 0),  english: 'Airport',                 spanish: 'Aeropuerto',                pronunciation: 'ah-e-ro-PWER-to',               category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 1),  english: 'Train station',           spanish: 'Estación de tren',          pronunciation: 'es-ta-THYON de tren',            category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 2),  english: 'Bus stop',                spanish: 'Parada de autobús',         pronunciation: 'pa-RA-da de ow-to-BOOS',         category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 3),  english: 'Left',                    spanish: 'Izquierda',                 pronunciation: 'ees-KYER-da',                    category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 4),  english: 'Right',                   spanish: 'Derecha',                   pronunciation: 'de-RE-cha',                      category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 5),  english: 'Straight on',             spanish: 'Todo recto',                pronunciation: 'TOH-do REK-to',                  category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 6),  english: 'Near',                    spanish: 'Cerca',                     pronunciation: 'THER-ka',                        category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 7),  english: 'Far',                     spanish: 'Lejos',                     pronunciation: 'LE-hos',                         category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 8),  english: 'Taxi',                    spanish: 'Taxi',                      pronunciation: 'TAK-see',                        category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 9),  english: 'Ticket',                  spanish: 'Billete',                   pronunciation: 'bee-YE-te',                      category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 10), english: 'Passport',                spanish: 'Pasaporte',                 pronunciation: 'pa-sa-POR-te',                   category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 11), english: 'Where is',                spanish: 'Dónde está',                pronunciation: 'DON-de es-TA',                   category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 12), english: 'How far',                 spanish: 'A qué distancia',           pronunciation: 'a ke dees-TAN-thya',             category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 13), english: "I'm lost",                spanish: 'Estoy perdido',             pronunciation: 'es-TOY per-DEE-do',              category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 14), english: 'Bus',                     spanish: 'Autobús',                   pronunciation: 'ow-to-BOOS',                     category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 15), english: 'Underground / Metro',     spanish: 'Metro',                     pronunciation: 'ME-tro',                         category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 16), english: 'Platform',                spanish: 'Andén',                     pronunciation: 'an-DEN',                         category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 17), english: 'Departure',               spanish: 'Salida',                    pronunciation: 'sa-LEE-da',                      category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 18), english: 'Arrival',                 spanish: 'Llegada',                   pronunciation: 'ye-GA-da',                       category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 19), english: 'Return ticket',           spanish: 'Billete de vuelta',         pronunciation: 'bee-YE-te de VWEL-ta',           category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 20), english: 'Single ticket',           spanish: 'Billete de ida',            pronunciation: 'bee-YE-te de EE-da',             category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 21), english: 'How long does it take?',  spanish: '¿Cuánto tiempo tarda?',     pronunciation: 'KWAN-to TYEM-po TAR-da',         category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 22), english: 'Car',                     spanish: 'Coche',                     pronunciation: 'KO-che',                         category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 23), english: 'Street',                  spanish: 'Calle',                     pronunciation: 'KA-ye',                          category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 24), english: 'City centre',             spanish: 'Centro de la ciudad',       pronunciation: 'THEN-tro de la thyoo-DAD',       category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 25), english: 'Map',                     spanish: 'Mapa',                      pronunciation: 'MA-pa',                          category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 26), english: 'Traffic lights',          spanish: 'Semáforo',                  pronunciation: 'se-MA-fo-ro',                    category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 27), english: 'Beach',                   spanish: 'Playa',                     pronunciation: 'PLA-ya',                         category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 28), english: 'Museum',                  spanish: 'Museo',                     pronunciation: 'moo-SE-o',                       category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 29), english: 'Church',                  spanish: 'Iglesia',                   pronunciation: 'ee-GLE-sya',                     category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 30), english: 'Old town',                spanish: 'Casco antiguo',             pronunciation: 'KAS-ko an-TEE-gwo',              category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('travel', 31), english: 'Motorway',                spanish: 'Autopista',                 pronunciation: 'ow-to-PEES-ta',                  category: 'getting_around', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },

  // ── EMERGENCIES ─────────────────────────────────────────────────────────
  { id: seedId('emerg', 0),  english: 'Help',                     spanish: 'Ayuda',                     pronunciation: 'ah-YOO-da',                      category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 1),  english: 'Doctor',                   spanish: 'Médico',                    pronunciation: 'ME-dee-ko',                      category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 2),  english: 'Hospital',                 spanish: 'Hospital',                  pronunciation: 'os-pee-TAL',                     category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 3),  english: 'Police',                   spanish: 'Policía',                   pronunciation: 'po-lee-THEE-a',                  category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 4),  english: 'Call',                     spanish: 'Llame',                     pronunciation: 'YA-me',                          category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 5),  english: 'Ambulance',                spanish: 'Ambulancia',                pronunciation: 'am-boo-LAN-thya',                category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 6),  english: 'Pharmacy',                 spanish: 'Farmacia',                  pronunciation: 'far-MA-thya',                    category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 7),  english: 'I need',                   spanish: 'Necesito',                  pronunciation: 'ne-the-SEE-to',                  category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 8),  english: 'Allergic to',              spanish: 'Alérgico a',                pronunciation: 'ah-LER-hee-ko ah',               category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 9),  english: 'Lost',                     spanish: 'Perdido',                   pronunciation: 'per-DEE-do',                     category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 10), english: 'Fire',                     spanish: 'Fuego',                     pronunciation: 'FWE-go',                         category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 11), english: 'Emergency',                spanish: 'Emergencia',                pronunciation: 'e-mer-HEN-thya',                 category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 12), english: 'Theft',                    spanish: 'Robo',                      pronunciation: 'RO-bo',                          category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 13), english: 'Accident',                 spanish: 'Accidente',                 pronunciation: 'ak-thee-DEN-te',                 category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 14), english: 'Pain',                     spanish: 'Dolor',                     pronunciation: 'do-LOR',                         category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 15), english: "I feel unwell",            spanish: 'Me siento mal',             pronunciation: 'me SYEN-to mal',                 category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 16), english: 'Dentist',                  spanish: 'Dentista',                  pronunciation: 'den-TEES-ta',                    category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 17), english: 'Prescription',             spanish: 'Receta',                    pronunciation: 're-THE-ta',                      category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 18), english: 'Insurance',                spanish: 'Seguro',                    pronunciation: 'se-GOO-ro',                      category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 19), english: 'Bleeding',                 spanish: 'Sangrado',                  pronunciation: 'san-GRA-do',                     category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
  { id: seedId('emerg', 20), english: 'I am diabetic',            spanish: 'Soy diabético',             pronunciation: 'soy dya-BE-tee-ko',              category: 'emergencies', is_favourite: false, use_count: 0, source: 'discovery', created_at: '' },
]

// Starter words shown by default for new users
export const STARTER_WORD_IDS: string[] = [
  seedId('greet', 0),   // Hello
  seedId('greet', 1),   // Goodbye
  seedId('greet', 2),   // Please
  seedId('greet', 3),   // Thank you
  seedId('greet', 7),   // Excuse me
  seedId('cafe', 0),    // Coffee
  seedId('cafe', 1),    // Tea
  seedId('cafe', 10),   // Still water
  seedId('cafe', 22),   // The bill (café)
  seedId('rest', 7),    // Beer
  seedId('rest', 4),    // The bill (restaurant)
  seedId('travel', 3),  // Left
  seedId('travel', 4),  // Right
  seedId('shop', 0),    // How much
  seedId('emerg', 0),   // Help
  seedId('emerg', 1),   // Doctor
]

// Connectors organized by QuickTap context
export const CONNECTORS: Record<QuickTapContext, Connector[]> = {
  eating_drinking: [
    { english: 'Can I get...', spanish: '¿Me puede traer...' },
    { english: 'I would like...', spanish: 'Quisiera...' },
    { english: 'Do you have...?', spanish: '¿Tiene...?' },
    { english: 'The bill please', spanish: 'La cuenta, por favor' },
    { english: 'A table for...', spanish: 'Una mesa para...' },
    { english: 'Without...', spanish: 'Sin...' },
    { english: 'Can we have some more...?', spanish: '¿Nos puede traer más...?' },
  ],
  shopping: [
    { english: 'How much is...?', spanish: '¿Cuánto cuesta...?' },
    { english: 'Do you have...?', spanish: '¿Tiene...?' },
    { english: "I'm looking for...", spanish: 'Estoy buscando...' },
    { english: "I'll take it", spanish: 'Me lo llevo' },
    { english: 'Can I try on...?', spanish: '¿Puedo probarme...?' },
  ],
  getting_around: [
    { english: 'Where is...?', spanish: '¿Dónde está...?' },
    { english: 'How far is...?', spanish: '¿A qué distancia está...?' },
    { english: 'Take me to...', spanish: 'Llévame a...' },
    { english: 'One ticket to...', spanish: 'Un billete a...' },
    { english: 'Is this the bus to...?', spanish: '¿Es este el autobús a...?' },
  ],
  hotel: [
    { english: 'I have a reservation', spanish: 'Tengo una reserva' },
    { english: 'Do you have a room?', spanish: '¿Tiene habitación?' },
    { english: 'Can I have...?', spanish: '¿Me puede dar...?' },
    { english: 'The room needs...', spanish: 'La habitación necesita...' },
    { english: 'What time is checkout?', spanish: '¿A qué hora es el check-out?' },
  ],
  emergencies: [
    { english: 'I need help', spanish: 'Necesito ayuda' },
    { english: 'Call...', spanish: 'Llame a...' },
    { english: "I'm allergic to...", spanish: 'Soy alérgico a...' },
    { english: "I've lost my...", spanish: 'He perdido mi...' },
    { english: 'Where is the nearest...?', spanish: '¿Dónde está el... más cercano?' },
  ],
}

export const SUFFIX_CHIPS: SuffixChip[] = [
  { english: 'please', spanish: 'por favor' },
  { english: 'now', spanish: 'ahora' },
  { english: 'for two', spanish: 'para dos' },
  { english: 'for one', spanish: 'para uno' },
]

// Words relevant to each QuickTap context — now maps to new situational categories
export const CONTEXT_CATEGORY_MAP: Record<QuickTapContext, string[]> = {
  eating_drinking: ['cafe', 'restaurant'],
  shopping:        ['shop'],
  getting_around:  ['getting_around'],
  hotel:           ['hotel'],
  emergencies:     ['emergencies'],
}

export interface SmartWord {
  id: string
  english: string
  spanish: string
}

export const CONNECTOR_SMART_WORDS: Record<string, SmartWord[]> = {
  // ── EATING & DRINKING ────────────────────────────────────────────────────
  'eating_drinking:¿Me puede traer...': [
    { id: 'csw_eat_0', english: 'the bill',        spanish: 'la cuenta' },
    { id: 'csw_eat_1', english: 'some water',      spanish: 'agua' },
    { id: 'csw_eat_2', english: 'some bread',      spanish: 'pan' },
    { id: 'csw_eat_3', english: 'the menu',        spanish: 'la carta' },
    { id: 'csw_eat_4', english: 'a glass of wine', spanish: 'un vaso de vino' },
    { id: 'csw_eat_5', english: 'a beer',          spanish: 'una cerveza' },
    { id: 'csw_eat_6', english: 'a coffee',        spanish: 'un café' },
    { id: 'csw_eat_7', english: 'some more',       spanish: 'un poco más' },
  ],
  'eating_drinking:Quisiera...': [
    { id: 'csw_eat_8',  english: 'a beer',           spanish: 'una cerveza' },
    { id: 'csw_eat_9',  english: 'a coffee',         spanish: 'un café' },
    { id: 'csw_eat_10', english: 'the house wine',   spanish: 'el vino de la casa' },
    { id: 'csw_eat_11', english: 'a red wine',       spanish: 'un vino tinto' },
    { id: 'csw_eat_12', english: 'a white wine',     spanish: 'un vino blanco' },
    { id: 'csw_eat_13', english: 'the menu',         spanish: 'la carta' },
    { id: 'csw_eat_14', english: 'a table',          spanish: 'una mesa' },
    { id: 'csw_eat_15', english: 'something to eat', spanish: 'algo de comer' },
  ],
  'eating_drinking:¿Tiene...?': [
    { id: 'csw_eat_16', english: 'a table',                spanish: 'una mesa' },
    { id: 'csw_eat_17', english: 'a menu in English',      spanish: 'una carta en inglés' },
    { id: 'csw_eat_18', english: 'a vegetarian option',    spanish: 'una opción vegetariana' },
    { id: 'csw_eat_19', english: 'still water',            spanish: 'agua sin gas' },
    { id: 'csw_eat_20', english: 'sparkling water',        spanish: 'agua con gas' },
    { id: 'csw_eat_21', english: "today's menu",           spanish: 'el menú del día' },
  ],
  'eating_drinking:Una mesa para...': [
    { id: 'csw_eat_22', english: 'one',   spanish: 'uno' },
    { id: 'csw_eat_23', english: 'two',   spanish: 'dos' },
    { id: 'csw_eat_24', english: 'three', spanish: 'tres' },
    { id: 'csw_eat_25', english: 'four',  spanish: 'cuatro' },
  ],
  'eating_drinking:Sin...': [
    { id: 'csw_eat_26', english: 'gluten',  spanish: 'gluten' },
    { id: 'csw_eat_27', english: 'lactose', spanish: 'lactosa' },
    { id: 'csw_eat_28', english: 'meat',    spanish: 'carne' },
    { id: 'csw_eat_29', english: 'spice',   spanish: 'picante' },
    { id: 'csw_eat_30', english: 'salt',    spanish: 'sal' },
  ],
  'eating_drinking:¿Nos puede traer más...?': [
    { id: 'csw_eat_31', english: 'water',    spanish: 'agua' },
    { id: 'csw_eat_32', english: 'bread',    spanish: 'pan' },
    { id: 'csw_eat_33', english: 'wine',     spanish: 'vino' },
    { id: 'csw_eat_34', english: 'napkins',  spanish: 'servilletas' },
    { id: 'csw_eat_35', english: 'glasses',  spanish: 'vasos' },
  ],

  // ── SHOPPING ─────────────────────────────────────────────────────────────
  'shopping:¿Cuánto cuesta...?': [
    { id: 'csw_shop_0', english: 'this',             spanish: 'esto' },
    { id: 'csw_shop_1', english: 'that one',         spanish: 'ése' },
    { id: 'csw_shop_2', english: 'the large size',   spanish: 'la talla grande' },
    { id: 'csw_shop_3', english: 'the small size',   spanish: 'la talla pequeña' },
    { id: 'csw_shop_4', english: 'this dress',       spanish: 'este vestido' },
    { id: 'csw_shop_5', english: 'these shoes',      spanish: 'estos zapatos' },
  ],
  'shopping:¿Tiene...?': [
    { id: 'csw_shop_6',  english: 'this in blue',     spanish: 'esto en azul' },
    { id: 'csw_shop_7',  english: 'this in my size',  spanish: 'esto en mi talla' },
    { id: 'csw_shop_8',  english: 'anything cheaper', spanish: 'algo más barato' },
    { id: 'csw_shop_9',  english: 'size large',       spanish: 'la talla grande' },
    { id: 'csw_shop_10', english: 'size medium',      spanish: 'la talla mediana' },
    { id: 'csw_shop_11', english: 'size small',       spanish: 'la talla pequeña' },
  ],
  'shopping:Estoy buscando...': [
    { id: 'csw_shop_12', english: 'a gift',          spanish: 'un regalo' },
    { id: 'csw_shop_13', english: 'summer clothes',  spanish: 'ropa de verano' },
    { id: 'csw_shop_14', english: 'souvenirs',       spanish: 'recuerdos' },
    { id: 'csw_shop_15', english: 'a pharmacy',      spanish: 'una farmacia' },
    { id: 'csw_shop_16', english: 'the supermarket', spanish: 'el supermercado' },
  ],
  'shopping:¿Puedo probarme...?': [
    { id: 'csw_shop_17', english: 'this',            spanish: 'esto' },
    { id: 'csw_shop_18', english: 'these trousers',  spanish: 'estos pantalones' },
    { id: 'csw_shop_19', english: 'this t-shirt',    spanish: 'esta camiseta' },
    { id: 'csw_shop_20', english: 'these trainers',  spanish: 'estas zapatillas' },
    { id: 'csw_shop_21', english: 'this jacket',     spanish: 'esta chaqueta' },
  ],

  // ── GETTING AROUND ───────────────────────────────────────────────────────
  'getting_around:¿Dónde está...?': [
    { id: 'csw_travel_0', english: 'the airport',       spanish: 'el aeropuerto' },
    { id: 'csw_travel_1', english: 'the train station', spanish: 'la estación de tren' },
    { id: 'csw_travel_2', english: 'the hotel',         spanish: 'el hotel' },
    { id: 'csw_travel_3', english: 'the toilet',        spanish: 'el baño' },
    { id: 'csw_travel_4', english: 'the pharmacy',      spanish: 'la farmacia' },
    { id: 'csw_travel_5', english: 'the bus stop',      spanish: 'la parada de autobús' },
    { id: 'csw_travel_6', english: 'the centre',        spanish: 'el centro' },
    { id: 'csw_travel_7', english: 'the beach',         spanish: 'la playa' },
  ],
  'getting_around:Llévame a...': [
    { id: 'csw_travel_8',  english: 'the airport',  spanish: 'el aeropuerto' },
    { id: 'csw_travel_9',  english: 'the hotel',    spanish: 'el hotel' },
    { id: 'csw_travel_10', english: 'this address', spanish: 'esta dirección' },
    { id: 'csw_travel_11', english: 'the centre',   spanish: 'el centro' },
    { id: 'csw_travel_12', english: 'the beach',    spanish: 'la playa' },
  ],
  'getting_around:Un billete a...': [
    { id: 'csw_travel_13', english: 'Madrid',      spanish: 'Madrid' },
    { id: 'csw_travel_14', english: 'Barcelona',   spanish: 'Barcelona' },
    { id: 'csw_travel_15', english: 'Valencia',    spanish: 'Valencia' },
    { id: 'csw_travel_16', english: 'the airport', spanish: 'el aeropuerto' },
    { id: 'csw_travel_17', english: 'the centre',  spanish: 'el centro' },
  ],
  'getting_around:¿Es este el autobús a...?': [
    { id: 'csw_travel_18', english: 'the airport',  spanish: 'el aeropuerto' },
    { id: 'csw_travel_19', english: 'the centre',   spanish: 'el centro' },
    { id: 'csw_travel_20', english: 'the beach',    spanish: 'la playa' },
    { id: 'csw_travel_21', english: 'the old town', spanish: 'el casco antiguo' },
  ],

  // ── HOTEL ────────────────────────────────────────────────────────────────
  'hotel:¿Me puede dar...?': [
    { id: 'csw_hotel_0', english: 'the key',           spanish: 'la llave' },
    { id: 'csw_hotel_1', english: 'more towels',       spanish: 'más toallas' },
    { id: 'csw_hotel_2', english: 'the WiFi password', spanish: 'la contraseña del WiFi' },
    { id: 'csw_hotel_3', english: 'an adaptor',        spanish: 'un adaptador' },
    { id: 'csw_hotel_4', english: 'more pillows',      spanish: 'más almohadas' },
    { id: 'csw_hotel_5', english: 'another key card',  spanish: 'otra tarjeta llave' },
  ],
  'hotel:La habitación necesita...': [
    { id: 'csw_hotel_6', english: 'cleaning',      spanish: 'limpieza' },
    { id: 'csw_hotel_7', english: 'new towels',    spanish: 'toallas nuevas' },
    { id: 'csw_hotel_8', english: 'repair',        spanish: 'reparación' },
    { id: 'csw_hotel_9', english: 'more hangers',  spanish: 'más perchas' },
  ],

  // ── EMERGENCIES ──────────────────────────────────────────────────────────
  'emergencies:Llame a...': [
    { id: 'csw_emerg_0', english: 'an ambulance', spanish: 'una ambulancia' },
    { id: 'csw_emerg_1', english: 'the police',   spanish: 'la policía' },
    { id: 'csw_emerg_2', english: 'a doctor',     spanish: 'un médico' },
    { id: 'csw_emerg_3', english: 'my family',    spanish: 'a mi familia' },
  ],
  'emergencies:Soy alérgico a...': [
    { id: 'csw_emerg_4', english: 'nuts',       spanish: 'los frutos secos' },
    { id: 'csw_emerg_5', english: 'seafood',    spanish: 'el marisco' },
    { id: 'csw_emerg_6', english: 'gluten',     spanish: 'el gluten' },
    { id: 'csw_emerg_7', english: 'lactose',    spanish: 'la lactosa' },
    { id: 'csw_emerg_8', english: 'penicillin', spanish: 'la penicilina' },
  ],
  'emergencies:He perdido mi...': [
    { id: 'csw_emerg_9',  english: 'passport',     spanish: 'pasaporte' },
    { id: 'csw_emerg_10', english: 'wallet',        spanish: 'cartera' },
    { id: 'csw_emerg_11', english: 'phone',         spanish: 'teléfono' },
    { id: 'csw_emerg_12', english: 'bag',           spanish: 'bolso' },
    { id: 'csw_emerg_13', english: 'credit card',   spanish: 'tarjeta de crédito' },
  ],
  'emergencies:¿Dónde está el... más cercano?': [
    { id: 'csw_emerg_14', english: 'hospital',       spanish: 'hospital' },
    { id: 'csw_emerg_15', english: 'pharmacy',       spanish: 'farmacia' },
    { id: 'csw_emerg_16', english: 'police station', spanish: 'comisaría de policía' },
    { id: 'csw_emerg_17', english: 'ATM',            spanish: 'cajero automático' },
  ],
}
