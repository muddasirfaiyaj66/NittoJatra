/** Common Dhaka place abbreviations → search terms (lowercase). */
export const LOCATION_ALIAS_GROUPS: string[][] = [
  ['uiu', 'united international university', 'united international', 'uiu campus'],
  ['diu', 'daffodil international university', 'daffodil university', 'daffodil'],
  ['bracu', 'brac university', 'brac'],
  ['nsu', 'north south university', 'north south'],
  ['iub', 'independent university bangladesh', 'independent university'],
  ['buet', 'bangladesh university of engineering'],
  ['du', 'dhaka university', 'university of dhaka'],
];

export function aliasTermsForQuery(rawQuery: string): string[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return [];
  }

  const terms = new Set<string>([query]);

  for (const group of LOCATION_ALIAS_GROUPS) {
    const matched = group.some(
      (term) => term === query || query.includes(term) || term.includes(query),
    );
    if (matched) {
      for (const term of group) {
        terms.add(term);
      }
    }
  }

  return [...terms];
}
