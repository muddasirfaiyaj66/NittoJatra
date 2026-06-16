/** Keep in sync with backend/src/locations/location-aliases.ts */
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

function scoreLocationMatch(
  query: string,
  location: { nameEn: string; name: string },
): number {
  const normalized = query.trim().toLowerCase();
  const nameEn = location.nameEn.toLowerCase();
  const name = location.name.toLowerCase();

  let score = 0;
  if (nameEn === normalized || name === normalized) score += 100;
  if (nameEn.startsWith(normalized) || normalized.startsWith(nameEn)) score += 50;
  if (name.startsWith(normalized) || normalized.startsWith(name)) score += 40;
  if (nameEn.includes(normalized) || normalized.includes(nameEn)) score += 25;
  if (name.includes(normalized) || normalized.includes(name)) score += 20;
  score -= nameEn.length * 0.05;
  return score;
}

export function resolveLocationByName<T extends { id: string; nameEn: string; name: string }>(
  locations: T[],
  query: string,
): T | undefined {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }

  const searchTerms = aliasTermsForQuery(query);
  let best: { location: T; score: number } | undefined;

  for (const location of locations) {
    for (const term of searchTerms) {
      const nameEn = location.nameEn.toLowerCase();
      const name = location.name.toLowerCase();
      const matches =
        nameEn === term ||
        name === term ||
        nameEn.includes(term) ||
        name.includes(term) ||
        term.includes(nameEn) ||
        term.includes(name);

      if (!matches) {
        continue;
      }

      const score = scoreLocationMatch(query, location);
      if (!best || score > best.score) {
        best = { location, score };
      }
    }
  }

  return best && best.score > 0 ? best.location : undefined;
}
