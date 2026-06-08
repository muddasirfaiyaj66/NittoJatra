import {
  ActivePlan,
  AppNotification,
  Booking,
  DriverRider,
  DriverSchedule,
  DhakaLocation,
  MessageThread,
  Operator,
  PaymentMethodItem,
  RideDetail,
  RouteItem,
  SavedPlace,
  SearchResult,
  TrustedContact,
  User,
  WalletTransaction,
} from '@/types';

export const DHAKA_LOCATIONS: DhakaLocation[] = [
  { id: 'loc1', name: 'Mirpur', nameEn: 'Mirpur', zone: 'North Dhaka' },
  { id: 'loc2', name: 'Uttara', nameEn: 'Uttara', zone: 'North Dhaka' },
  { id: 'loc3', name: 'Gulshan', nameEn: 'Gulshan', zone: 'East Dhaka' },
  { id: 'loc4', name: 'Banani', nameEn: 'Banani', zone: 'East Dhaka' },
  { id: 'loc5', name: 'Motijheel', nameEn: 'Motijheel', zone: 'Central Dhaka' },
  { id: 'loc6', name: 'Farmgate', nameEn: 'Farmgate', zone: 'Central Dhaka' },
  { id: 'loc7', name: 'Shahbag', nameEn: 'Shahbag', zone: 'Central Dhaka' },
  { id: 'loc8', name: 'Paltan', nameEn: 'Paltan', zone: 'Central Dhaka' },
  { id: 'loc9', name: 'Dhanmondi', nameEn: 'Dhanmondi', zone: 'West Dhaka' },
  { id: 'loc10', name: 'Mohammadpur', nameEn: 'Mohammadpur', zone: 'West Dhaka' },
];

export const MOCK_ROUTES: RouteItem[] = [
  { id: '1', from: 'Shahbag', fromEn: 'Shahbag', to: 'Motijheel', toEn: 'Motijheel', duration: '45 min', priceFrom: 120, image: null },
  { id: '2', from: 'Dhanmondi', fromEn: 'Dhanmondi', to: 'Gulshan', toEn: 'Gulshan', duration: '40 min', priceFrom: 150, image: null },
  { id: '3', from: 'Uttara', fromEn: 'Uttara', to: 'Farmgate', toEn: 'Farmgate', duration: '50 min', priceFrom: 130, image: null },
];

export const MOCK_OPERATORS: Operator[] = [
  { id: 'op1', name: 'Karim Uddin', rating: 4.9, type: 'AC', color: '#4F46E5', vehicle: 'Toyota Corolla', plate: 'Metro-11-1234' },
  { id: 'op2', name: 'Rashid Ahmed', rating: 4.7, type: 'AC', color: '#10B981', vehicle: 'Honda City', plate: 'Dhaka-GA-11-5678' },
  { id: 'op3', name: 'Nadia Islam', rating: 4.8, type: 'Women Special', color: '#EC4899', vehicle: 'Toyota Axio', plate: 'Metro-DA-22-9012' },
  { id: 'op4', name: 'Farhan Ali', rating: 4.5, type: 'Express', color: '#7C3AED', vehicle: 'Suzuki Swift', plate: 'Dhaka-CHA-33-3456' },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Ahmed Rahman',
  email: 'rider@example.com',
  phone: '+8801712345678',
  avatar: null,
  role: 'rider',
  memberSince: '2024-01-15',
  totalTrips: 42,
  totalSpent: 3240,
  points: 1250,
  rating: 4.8,
  tier: 'GOLD',
};

export const MOCK_DRIVER: User = {
  id: 'd1',
  name: 'Karim Uddin',
  email: 'captain@example.com',
  phone: '+8801812345678',
  avatar: null,
  role: 'driver',
  memberSince: '2022-06-01',
  totalTrips: 1450,
  totalSpent: 0,
  points: 0,
  rating: 4.9,
  vehicle: 'Toyota Axio 2018',
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-001',
    status: 'ongoing',
    route: { from: 'Shahbag', to: 'Motijheel' },
    date: '2026-06-08',
    departureTime: '08:00',
    arrivalTime: '08:45',
    seatCount: 1,
    operator: 'Karim Uddin',
    amount: 120,
    driver: 'Karim Uddin',
  },
  {
    id: 'BK-2026-002',
    status: 'completed',
    route: { from: 'Dhanmondi', to: 'Gulshan' },
    date: '2026-06-01',
    departureTime: '09:00',
    arrivalTime: '09:40',
    seatCount: 1,
    operator: 'Rashid Ahmed',
    amount: 150,
  },
  {
    id: 'BK-2026-003',
    status: 'cancelled',
    route: { from: 'Uttara', to: 'Farmgate' },
    date: '2026-05-28',
    departureTime: '07:30',
    arrivalTime: '08:20',
    seatCount: 2,
    operator: 'Farhan Ali',
    amount: 260,
  },
];

export const MOCK_ACTIVE_PLAN: ActivePlan = {
  id: 'plan1',
  route: 'Shahbag ↔ Motijheel',
  schedule: 'Mon, Tue, Wed, Thu, Fri • 08:00 AM',
  progress: { current: 8, total: 20 },
  driver: { name: 'Karim Uddin', initial: 'K' },
  nextTrip: 'Tomorrow at 8:00 AM',
  status: 'ongoing',
};

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  { id: 'r1', operatorId: 'op1', from: 'Shahbag', to: 'Motijheel', departure: '08:30', arrival: '09:15', duration: '45m', price: 150, seatsAvailable: 3, rating: 4.9, type: 'AC', distance: '8.5 km' },
  { id: 'r2', operatorId: 'op3', from: 'Shahbag', to: 'Motijheel', departure: '08:00', arrival: '08:45', duration: '45m', price: 120, seatsAvailable: 1, rating: 4.8, type: 'Women Special', womenOnly: true, distance: '8.5 km' },
];

export const MOCK_RIDE_DETAILS: Record<string, RideDetail> = {
  r1: {
    id: 'r1',
    operatorId: 'op1',
    from: 'Shahbag',
    to: 'Motijheel',
    departure: '08:00',
    arrival: '08:45',
    duration: '45 mins',
    price: 120,
    seatsAvailable: 3,
    rating: 4.9,
    type: 'AC',
    distance: '8.5 km',
    routeName: 'Office Route',
    badge: 'Regular Commute',
    slot: 'MORNING SLOT',
    facilities: ['AC', 'Music', 'Phone Charging', 'Spacious', 'Wifi'],
    stops: [
      { name: 'Shahbag', label: 'Pickup Point', time: '08:00 AM' },
      { name: 'Kakrail', label: 'Midway Stop', time: '08:15 AM' },
      { name: 'Motijheel', label: 'Destination', time: '08:45 AM' },
    ],
    reviews: [
      { id: 'rv1', author: 'Sara K.', initial: 'S', rating: 5, timeAgo: '2 days ago', quote: 'Always on time and very professional.' },
      { id: 'rv2', author: 'Tanvir H.', initial: 'T', rating: 4, timeAgo: '1 week ago', quote: 'Clean car and smooth ride.' },
    ],
    subscriptionPlans: [
      { id: 'sp1', name: 'Weekly', price: 600, discount: 17 },
      { id: 'sp2', name: 'Monthly', price: 2400, discount: 33, selected: true },
      { id: 'sp3', name: 'Quarterly', price: 6800, discount: 40 },
    ],
  },
  r2: {
    id: 'r2',
    operatorId: 'op3',
    from: 'Shahbag',
    to: 'Motijheel',
    departure: '08:00',
    arrival: '08:45',
    duration: '45 mins',
    price: 120,
    seatsAvailable: 1,
    rating: 4.8,
    type: 'Women Special',
    womenOnly: true,
    distance: '8.5 km',
    routeName: 'Office Route',
    badge: 'Regular Commute',
    slot: 'MORNING SLOT',
    facilities: ['AC', 'Music', 'Phone Charging'],
    stops: [
      { name: 'Shahbag', label: 'Pickup Point', time: '08:00 AM' },
      { name: 'Motijheel', label: 'Destination', time: '08:45 AM' },
    ],
    reviews: [],
    subscriptionPlans: [
      { id: 'sp1', name: 'Weekly', price: 600, discount: 17 },
      { id: 'sp2', name: 'Monthly', price: 2400, discount: 33, selected: true },
      { id: 'sp3', name: 'Quarterly', price: 6800, discount: 40 },
    ],
  },
};

export const RECENT_PLACES = [
  { id: 'rp1', name: 'Motijheel Dilkusha', label: 'Work' },
  { id: 'rp2', name: 'Bashundhara City', label: 'Mall' },
  { id: 'rp3', name: 'Dhanmondi 27', label: 'Home' },
];

export const TRUSTED_CONTACTS: TrustedContact[] = [
  { id: 'tc1', name: 'Mom', phone: '01700000000', initial: 'M' },
  { id: 'tc2', name: 'Dad', phone: '01800000000', initial: 'D' },
];

export const SAVED_PLACES: SavedPlace[] = [
  { id: 'sp1', label: 'Home', address: 'Dhanmondi 27, Dhaka', type: 'home' },
  { id: 'sp2', label: 'Office', address: 'Motijheel Dilkusha, Dhaka', type: 'office' },
];

export const WALLET_BALANCE = 2540.5;

export const PAYMENT_METHODS: PaymentMethodItem[] = [
  { id: 'pm1', type: 'wallet', label: 'NittoJatra Wallet', detail: 'Balance ৳2,540', balance: 2540 },
  { id: 'pm2', type: 'bkash', label: 'bKash', detail: '…8392' },
  { id: 'pm3', type: 'visa', label: 'VISA', detail: '…4242' },
];

export const WALLET_TRANSACTIONS: WalletTransaction[] = [
  { id: 'wt1', title: 'Ride Payment', subtitle: 'Shahbag → Motijheel', amount: -350, type: 'debit', timestamp: 'Today, 8:45 AM' },
  { id: 'wt2', title: 'Wallet Top-up', subtitle: 'bKash Transfer', amount: 1000, type: 'credit', timestamp: 'Yesterday' },
  { id: 'wt3', title: 'Subscription', subtitle: 'Monthly Pass', amount: -2400, type: 'debit', timestamp: 'Jan 1, 2026' },
];

export const MESSAGE_THREADS: MessageThread[] = [
  { id: 'm1', name: 'Karim Uddin', lastMessage: 'I am at the pickup point', time: '2m', unread: 2, online: true, initial: 'K' },
  { id: 'm2', name: 'Support Team', lastMessage: 'Your ticket has been resolved', time: '1h', unread: 0, initial: 'S' },
  { id: 'm3', name: 'Nadia Islam', lastMessage: 'See you tomorrow morning', time: '3h', unread: 0, initial: 'N' },
];

export const APP_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Booking Confirmed!', body: 'Your ride from Shahbag to Motijheel is confirmed for tomorrow.', timeAgo: '5m ago', type: 'success', unread: true },
  { id: 'n2', title: '20% Off Your Next Ride', body: 'Use code COMMUTE20 on your next booking.', timeAgo: '2h ago', type: 'promo', unread: true },
  { id: 'n3', title: 'Schedule Change', body: 'Your driver updated the pickup time to 8:15 AM.', timeAgo: '1d ago', type: 'warning', unread: false },
  { id: 'n4', title: 'Welcome to NittoJatra', body: 'Start your first commute today.', timeAgo: '3d ago', type: 'info', unread: false },
];

export const DRIVER_BALANCE = 15240;
export const DRIVER_PAYOUT = 42850;
export const DRIVER_PENDING = 2400;

export const DRIVER_SCHEDULES: DriverSchedule[] = [
  {
    id: 'ds1',
    name: 'Morning Commute',
    time: '08:00 AM',
    days: 'MON-FRI',
    origin: 'Shahbag',
    destination: 'Motijheel',
    seatsFilled: 3,
    totalSeats: 4,
    riders: ['A', 'S', 'R'],
    status: 'active',
  },
  {
    id: 'ds2',
    name: 'Evening Return',
    time: '06:00 PM',
    days: 'MON-FRI',
    origin: 'Motijheel',
    destination: 'Shahbag',
    seatsFilled: 2,
    totalSeats: 4,
    riders: ['A', 'M'],
    status: 'active',
  },
];

export const CONNECTED_RIDERS: DriverRider[] = [
  { id: 'cr1', name: 'Ahmed Rahman', initial: 'A', verified: true, plan: 'Monthly', amount: 2400 },
  { id: 'cr2', name: 'Sara Khan', initial: 'S', verified: true, plan: 'Weekly', amount: 600 },
  { id: 'cr3', name: 'Rahim Ali', initial: 'R', verified: true, plan: 'Monthly', amount: 2400 },
];

export const getOperatorById = (id: string): Operator | undefined =>
  MOCK_OPERATORS.find((op) => op.id === id);

export const getRideDetail = (id: string): RideDetail =>
  MOCK_RIDE_DETAILS[id] ?? MOCK_RIDE_DETAILS.r1;
