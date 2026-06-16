export interface RideSeedEntry {
  fromNameEn: string;
  toNameEn: string;
  operatorCode: string;
  departureHour: number;
  departureMinute: number;
  serviceType: string;
  totalSeats?: number;
  priceOffset?: number;
}

export const RIDES_SEED: RideSeedEntry[] = [
  {
    fromNameEn: 'Mirpur',
    toNameEn: 'Motijheel',
    operatorCode: 'BRTC',
    departureHour: 7,
    departureMinute: 0,
    serviceType: 'ac',
  },
  {
    fromNameEn: 'Mirpur',
    toNameEn: 'Motijheel',
    operatorCode: 'DHAKA_CHAKA',
    departureHour: 7,
    departureMinute: 20,
    serviceType: 'non-ac',
  },
  {
    fromNameEn: 'Uttara',
    toNameEn: 'Gulshan',
    operatorCode: 'NAGAR',
    departureHour: 7,
    departureMinute: 40,
    serviceType: 'ac',
  },
  {
    fromNameEn: 'Dhanmondi',
    toNameEn: 'Shahbag',
    operatorCode: 'PROBAHO',
    departureHour: 8,
    departureMinute: 0,
    serviceType: 'women-special',
    totalSeats: 28,
  },
  {
    fromNameEn: 'Badda',
    toNameEn: 'Farmgate',
    operatorCode: 'SAJEDA',
    departureHour: 8,
    departureMinute: 20,
    serviceType: 'express',
    totalSeats: 24,
  },
  {
    fromNameEn: 'Mohammadpur',
    toNameEn: 'Paltan',
    operatorCode: 'METRO',
    departureHour: 8,
    departureMinute: 40,
    serviceType: 'ac',
  },
  {
    fromNameEn: 'Rampura',
    toNameEn: 'Sadarghat',
    operatorCode: 'BRTC',
    departureHour: 9,
    departureMinute: 0,
    serviceType: 'ac',
  },
  {
    fromNameEn: 'Rampura',
    toNameEn: 'Sadarghat',
    operatorCode: 'NAGAR',
    departureHour: 9,
    departureMinute: 30,
    serviceType: 'non-ac',
  },
  {
    fromNameEn: 'UIU',
    toNameEn: 'DIU',
    operatorCode: 'BRTC',
    departureHour: 8,
    departureMinute: 30,
    serviceType: 'ac',
  },
];
