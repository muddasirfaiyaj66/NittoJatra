import {
  Booking,
  DhakaLocation,
  Operator,
  RouteItem,
  SearchResult,
  User,
} from '@/types';

export const DHAKA_LOCATIONS: DhakaLocation[] = [
  { id: 'loc1', name: 'মিরপুর', nameEn: 'Mirpur', zone: 'North Dhaka' },
  { id: 'loc2', name: 'উত্তরা', nameEn: 'Uttara', zone: 'North Dhaka' },
  { id: 'loc3', name: 'গুলশান', nameEn: 'Gulshan', zone: 'East Dhaka' },
  { id: 'loc4', name: 'বনানী', nameEn: 'Banani', zone: 'East Dhaka' },
  { id: 'loc5', name: 'মতিঝিল', nameEn: 'Motijheel', zone: 'Central Dhaka' },
  { id: 'loc6', name: 'ফার্মগেট', nameEn: 'Farmgate', zone: 'Central Dhaka' },
  { id: 'loc7', name: 'শাহবাগ', nameEn: 'Shahbag', zone: 'Central Dhaka' },
  { id: 'loc8', name: 'পল্টন', nameEn: 'Paltan', zone: 'Central Dhaka' },
  { id: 'loc9', name: 'ধানমণ্ডি', nameEn: 'Dhanmondi', zone: 'West Dhaka' },
  { id: 'loc10', name: 'মোহাম্মদপুর', nameEn: 'Mohammadpur', zone: 'West Dhaka' },
  { id: 'loc11', name: 'বাড্ডা', nameEn: 'Badda', zone: 'East Dhaka' },
  { id: 'loc12', name: 'রামপুরা', nameEn: 'Rampura', zone: 'East Dhaka' },
  { id: 'loc13', name: 'যাত্রাবাড়ী', nameEn: 'Jatrabari', zone: 'South Dhaka' },
  { id: 'loc14', name: 'সদরঘাট', nameEn: 'Sadarghat', zone: 'South Dhaka' },
  { id: 'loc15', name: 'আজিমপুর', nameEn: 'Azimpur', zone: 'South Dhaka' },
];

export const MOCK_ROUTES: RouteItem[] = [
  { id: '1', from: 'মিরপুর', fromEn: 'Mirpur', to: 'মতিঝিল', toEn: 'Motijheel', duration: '35 min', priceFrom: 25, image: null },
  { id: '2', from: 'উত্তরা', fromEn: 'Uttara', to: 'গুলশান', toEn: 'Gulshan', duration: '40 min', priceFrom: 30, image: null },
  { id: '3', from: 'ধানমণ্ডি', fromEn: 'Dhanmondi', to: 'শাহবাগ', toEn: 'Shahbag', duration: '20 min', priceFrom: 15, image: null },
  { id: '4', from: 'বাড্ডা', fromEn: 'Badda', to: 'ফার্মগেট', toEn: 'Farmgate', duration: '30 min', priceFrom: 20, image: null },
  { id: '5', from: 'মোহাম্মদপুর', fromEn: 'Mohammadpur', to: 'পল্টন', toEn: 'Paltan', duration: '45 min', priceFrom: 25, image: null },
  { id: '6', from: 'রামপুরা', fromEn: 'Rampura', to: 'সদরঘাট', toEn: 'Sadarghat', duration: '50 min', priceFrom: 20, image: null },
];

export const MOCK_OPERATORS: Operator[] = [
  { id: 'op1', name: 'BRTC City Bus', rating: 4.2, type: 'AC', color: '#4F46E5' },
  { id: 'op2', name: 'Dhaka Chaka', rating: 4.5, type: 'Non-AC', color: '#059669' },
  { id: 'op3', name: 'Nagar Paribahan', rating: 4.3, type: 'AC', color: '#D97706' },
  { id: 'op4', name: 'Probaho', rating: 4.6, type: 'Women Special', color: '#EC4899' },
  { id: 'op5', name: 'Sajeda Transport', rating: 4.1, type: 'Express', color: '#7C3AED' },
  { id: 'op6', name: 'Dhaka Metro Shuttle', rating: 4.7, type: 'AC', color: '#0EA5E9' },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Rahim Uddin',
  email: 'demo@nittojatra.com',
  phone: '+8801712345678',
  avatar: null,
  memberSince: '2024-01-15',
  totalTrips: 23,
  totalSpent: 1840,
  points: 920,
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-2025-001',
    status: 'upcoming',
    route: { from: 'Mirpur', to: 'Motijheel' },
    date: '2025-12-20',
    departureTime: '08:00',
    arrivalTime: '08:35',
    seats: ['A3'],
    operator: 'BRTC City Bus',
    amount: 25,
  },
  {
    id: 'BK-2025-002',
    status: 'upcoming',
    route: { from: 'Uttara', to: 'Gulshan' },
    date: '2025-12-21',
    departureTime: '09:15',
    arrivalTime: '09:55',
    seats: ['B2'],
    operator: 'Probaho',
    amount: 30,
  },
  {
    id: 'BK-2025-003',
    status: 'completed',
    route: { from: 'Dhanmondi', to: 'Shahbag' },
    date: '2025-11-10',
    departureTime: '07:30',
    arrivalTime: '07:50',
    seats: ['C1'],
    operator: 'Nagar Paribahan',
    amount: 15,
  },
  {
    id: 'BK-2025-004',
    status: 'cancelled',
    route: { from: 'Badda', to: 'Farmgate' },
    date: '2025-11-05',
    departureTime: '10:00',
    arrivalTime: '10:30',
    seats: ['D4'],
    operator: 'Dhaka Chaka',
    amount: 20,
  },
];

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  { id: 'r1', operatorId: 'op1', from: 'Mirpur', to: 'Motijheel', departure: '07:00', arrival: '07:35', duration: '35 min', price: 25, seatsAvailable: 12, rating: 4.2, type: 'AC' },
  { id: 'r2', operatorId: 'op4', from: 'Mirpur', to: 'Motijheel', departure: '07:15', arrival: '07:50', duration: '35 min', price: 20, seatsAvailable: 6, rating: 4.6, type: 'Women Special' },
  { id: 'r3', operatorId: 'op3', from: 'Mirpur', to: 'Motijheel', departure: '07:30', arrival: '08:10', duration: '40 min', price: 18, seatsAvailable: 20, rating: 4.3, type: 'Non-AC' },
  { id: 'r4', operatorId: 'op5', from: 'Mirpur', to: 'Motijheel', departure: '07:45', arrival: '08:15', duration: '30 min', price: 35, seatsAvailable: 4, rating: 4.1, type: 'Express' },
  { id: 'r5', operatorId: 'op6', from: 'Mirpur', to: 'Motijheel', departure: '08:00', arrival: '08:35', duration: '35 min', price: 28, seatsAvailable: 15, rating: 4.7, type: 'AC' },
  { id: 'r6', operatorId: 'op2', from: 'Mirpur', to: 'Motijheel', departure: '08:20', arrival: '09:00', duration: '40 min', price: 15, seatsAvailable: 30, rating: 4.5, type: 'Non-AC' },
  { id: 'r7', operatorId: 'op1', from: 'Mirpur', to: 'Motijheel', departure: '08:45', arrival: '09:20', duration: '35 min', price: 25, seatsAvailable: 8, rating: 4.2, type: 'AC' },
  { id: 'r8', operatorId: 'op4', from: 'Mirpur', to: 'Motijheel', departure: '09:00', arrival: '09:35', duration: '35 min', price: 20, seatsAvailable: 2, rating: 4.6, type: 'Women Special' },
];

export const getOperatorById = (id: string): Operator | undefined =>
  MOCK_OPERATORS.find((op) => op.id === id);
