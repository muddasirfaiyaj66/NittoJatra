export interface RouteSeedEntry {
  fromNameEn: string;
  toNameEn: string;
  distanceKm: number;
  estimatedMinutes: number;
  basePrice: number;
}

export const ROUTES_SEED: RouteSeedEntry[] = [
  {
    fromNameEn: 'Mirpur',
    toNameEn: 'Motijheel',
    distanceKm: 12,
    estimatedMinutes: 35,
    basePrice: 25,
  },
  {
    fromNameEn: 'Uttara',
    toNameEn: 'Gulshan',
    distanceKm: 14,
    estimatedMinutes: 40,
    basePrice: 30,
  },
  {
    fromNameEn: 'Dhanmondi',
    toNameEn: 'Shahbag',
    distanceKm: 5,
    estimatedMinutes: 20,
    basePrice: 15,
  },
  {
    fromNameEn: 'Badda',
    toNameEn: 'Farmgate',
    distanceKm: 9,
    estimatedMinutes: 30,
    basePrice: 20,
  },
  {
    fromNameEn: 'Mohammadpur',
    toNameEn: 'Paltan',
    distanceKm: 11,
    estimatedMinutes: 45,
    basePrice: 25,
  },
  {
    fromNameEn: 'Rampura',
    toNameEn: 'Sadarghat',
    distanceKm: 13,
    estimatedMinutes: 50,
    basePrice: 20,
  },
  {
    fromNameEn: 'UIU',
    toNameEn: 'DIU',
    distanceKm: 6,
    estimatedMinutes: 25,
    basePrice: 35,
  },
];
