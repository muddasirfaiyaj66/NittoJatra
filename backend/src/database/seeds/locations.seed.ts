export interface LocationSeedEntry {
  name: string;
  nameEn: string;
  zone: string;
  coordinates: [number, number];
  sortOrder: number;
}

export const LOCATIONS_SEED: LocationSeedEntry[] = [
  {
    name: 'মিরপুর',
    nameEn: 'Mirpur',
    zone: 'North Dhaka',
    coordinates: [90.3563, 23.8041],
    sortOrder: 0,
  },
  {
    name: 'উত্তরা',
    nameEn: 'Uttara',
    zone: 'North Dhaka',
    coordinates: [90.3988, 23.8759],
    sortOrder: 1,
  },
  {
    name: 'গুলশান',
    nameEn: 'Gulshan',
    zone: 'East Dhaka',
    coordinates: [90.4152, 23.7935],
    sortOrder: 2,
  },
  {
    name: 'বনানী',
    nameEn: 'Banani',
    zone: 'East Dhaka',
    coordinates: [90.4042, 23.7937],
    sortOrder: 3,
  },
  {
    name: 'মতিঝিল',
    nameEn: 'Motijheel',
    zone: 'Central Dhaka',
    coordinates: [90.4196, 23.7337],
    sortOrder: 4,
  },
  {
    name: 'ফার্মগেট',
    nameEn: 'Farmgate',
    zone: 'Central Dhaka',
    coordinates: [90.3912, 23.7583],
    sortOrder: 5,
  },
  {
    name: 'শাহবাগ',
    nameEn: 'Shahbag',
    zone: 'Central Dhaka',
    coordinates: [90.3958, 23.7387],
    sortOrder: 6,
  },
  {
    name: 'পল্টন',
    nameEn: 'Paltan',
    zone: 'Central Dhaka',
    coordinates: [90.4137, 23.7337],
    sortOrder: 7,
  },
  {
    name: 'ধানমণ্ডি',
    nameEn: 'Dhanmondi',
    zone: 'West Dhaka',
    coordinates: [90.3742, 23.7461],
    sortOrder: 8,
  },
  {
    name: 'মোহাম্মদপুর',
    nameEn: 'Mohammadpur',
    zone: 'West Dhaka',
    coordinates: [90.3587, 23.7582],
    sortOrder: 9,
  },
  {
    name: 'বাড্ডা',
    nameEn: 'Badda',
    zone: 'East Dhaka',
    coordinates: [90.4319, 23.7796],
    sortOrder: 10,
  },
  {
    name: 'রামপুরা',
    nameEn: 'Rampura',
    zone: 'East Dhaka',
    coordinates: [90.4261, 23.7554],
    sortOrder: 11,
  },
  {
    name: 'যাত্রাবাড়ী',
    nameEn: 'Jatrabari',
    zone: 'South Dhaka',
    coordinates: [90.4324, 23.7112],
    sortOrder: 12,
  },
  {
    name: 'সদরঘাট',
    nameEn: 'Sadarghat',
    zone: 'South Dhaka',
    coordinates: [90.4086, 23.7104],
    sortOrder: 13,
  },
  {
    name: 'আজিমপুর',
    nameEn: 'Azimpur',
    zone: 'South Dhaka',
    coordinates: [90.3883, 23.7237],
    sortOrder: 14,
  },
];
