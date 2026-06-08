export interface OperatorSeedEntry {
  name: string;
  code: string;
  brandColor: string;
  primaryType: string;
  rating: number;
  serviceTypes: string[];
}

export const OPERATORS_SEED: OperatorSeedEntry[] = [
  {
    name: 'BRTC City Bus',
    code: 'BRTC',
    brandColor: '#4F46E5',
    primaryType: 'ac',
    rating: 4.2,
    serviceTypes: ['ac'],
  },
  {
    name: 'Dhaka Chaka',
    code: 'DHAKA_CHAKA',
    brandColor: '#059669',
    primaryType: 'non-ac',
    rating: 4.5,
    serviceTypes: ['non-ac'],
  },
  {
    name: 'Nagar Paribahan',
    code: 'NAGAR',
    brandColor: '#D97706',
    primaryType: 'ac',
    rating: 4.3,
    serviceTypes: ['ac', 'non-ac'],
  },
  {
    name: 'Probaho',
    code: 'PROBAHO',
    brandColor: '#EC4899',
    primaryType: 'women-special',
    rating: 4.6,
    serviceTypes: ['women-special', 'ac'],
  },
  {
    name: 'Sajeda Transport',
    code: 'SAJEDA',
    brandColor: '#7C3AED',
    primaryType: 'express',
    rating: 4.1,
    serviceTypes: ['express'],
  },
  {
    name: 'Dhaka Metro Shuttle',
    code: 'METRO',
    brandColor: '#0EA5E9',
    primaryType: 'ac',
    rating: 4.7,
    serviceTypes: ['ac', 'express'],
  },
];
