// Fallback data - usado apenas para validação de tipos
const BOOKS = [
  ['gen', 'Gênesis', 50],
  ['exo', 'Êxodo', 40],
  ['lev', 'Levítico', 27],
  ['num', 'Números', 36],
  ['deu', 'Deuteronômio', 34],
  ['jos', 'Josué', 24],
  ['jdg', 'Juízes', 21],
  ['rut', 'Rute', 4],
  ['1sa', '1 Samuel', 31],
  ['2sa', '2 Samuel', 24],
  ['1ki', '1 Reis', 22],
  ['2ki', '2 Reis', 25],
  ['1ch', '1 Crônicas', 29],
  ['2ch', '2 Crônicas', 36],
  ['ezr', 'Esdras', 10],
  ['neh', 'Neemias', 13],
  ['est', 'Ester', 10],
  ['job', 'Jó', 42],
  ['psa', 'Salmos', 150],
  ['pro', 'Provérbios', 31],
  ['ecc', 'Eclesiastes', 12],
  ['sng', 'Cantares', 8],
  ['isa', 'Isaías', 66],
  ['jer', 'Jeremias', 52],
  ['lam', 'Lamentações', 5],
  ['ezk', 'Ezequiel', 48],
  ['dan', 'Daniel', 12],
  ['hos', 'Oséias', 14],
  ['jol', 'Joel', 3],
  ['amo', 'Amós', 9],
  ['oba', 'Obadias', 1],
  ['jon', 'Jonas', 4],
  ['mic', 'Miquéias', 7],
  ['nam', 'Naum', 3],
  ['hab', 'Habacuque', 3],
  ['zep', 'Sofonias', 3],
  ['hag', 'Ageu', 2],
  ['zec', 'Zacarias', 14],
  ['mal', 'Malaquias', 4],
  ['mat', 'Mateus', 28],
  ['mrk', 'Marcos', 16],
  ['luk', 'Lucas', 24],
  ['jhn', 'João', 21],
  ['act', 'Atos', 28],
  ['rom', 'Romanos', 16],
  ['1co', '1 Coríntios', 16],
  ['2co', '2 Coríntios', 13],
  ['gal', 'Gálatas', 6],
  ['eph', 'Efésios', 6],
  ['php', 'Filipenses', 4],
  ['col', 'Colossenses', 4],
  ['1th', '1 Tessalonicenses', 5],
  ['2th', '2 Tessalonicenses', 3],
  ['1ti', '1 Timóteo', 6],
  ['2ti', '2 Timóteo', 4],
  ['tit', 'Tito', 3],
  ['phm', 'Filemom', 1],
  ['heb', 'Hebreus', 13],
  ['jas', 'Tiago', 5],
  ['1pe', '1 Pedro', 5],
  ['2pe', '2 Pedro', 3],
  ['1jn', '1 João', 5],
  ['2jn', '2 João', 1],
  ['3jn', '3 João', 1],
  ['jud', 'Judas', 1],
  ['rev', 'Apocalipse', 22],
] as const

export type BookAbbreviationType = typeof BOOKS[number][0]

export const BookAbbreviation = Object.fromEntries(
  BOOKS.map(([key]) => [key, key])
) as { [K in BookAbbreviationType]: K }

const bookAbbreviationSet = new Set<string>(BOOKS.map(([key]) => key))

export function isValidBookAbbreviation(value: string): value is BookAbbreviationType {
  return bookAbbreviationSet.has(value)
}

export function getBookAbbreviation(key: string): BookAbbreviationType | undefined {
  const lowerKey = key.toLowerCase()
  return isValidBookAbbreviation(lowerKey) ? lowerKey : undefined
}
