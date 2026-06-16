export type Gender = 'male' | 'female' | 'other';
export type UserRole = 'rider' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  gender?: Gender;
  role: UserRole;
  memberSince: string;
  totalTrips: number;
  totalSpent: number;
  points: number;
  rating?: number;
  tier?: 'GOLD' | 'SILVER' | 'BRONZE';
  vehicle?: string;
  savedLocation?: string;
  co2Saved?: string;
  activePlans?: number;
  driverBalance?: number;
  activeRiders?: number;
  emergencyContact?: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
  gender: Gender;
  role: UserRole;
}

export interface DhakaLocation {
  id: string;
  name: string;
  nameEn: string;
  zone: string;
  latitude?: number;
  longitude?: number;
}

export interface RouteItem {
  id: string;
  from: string;
  fromEn: string;
  to: string;
  toEn: string;
  duration: string;
  priceFrom: number;
  image: string | null;
}

export type ServiceType = 'AC' | 'Non-AC' | 'Women Special' | 'Express';

export interface Operator {
  id: string;
  name: string;
  rating: number;
  type: ServiceType;
  color: string;
  vehicle?: string;
  plate?: string;
}

export interface SearchResult {
  id: string;
  operatorId: string;
  operatorName?: string;
  operatorColor?: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  rating: number;
  type: ServiceType;
  womenOnly?: boolean;
  distance?: string;
}

export interface RideStop {
  name: string;
  label: string;
  time: string;
}

export interface RideDetail extends SearchResult {
  routeName: string;
  badge?: string;
  slot?: string;
  facilities: string[];
  stops: RideStop[];
  reviews: RideReview[];
  subscriptionPlans: SubscriptionPlan[];
}

export interface RideReview {
  id: string;
  author: string;
  initial: string;
  rating: number;
  timeAgo: string;
  quote: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  discount: number;
  selected?: boolean;
}

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'ongoing';

export interface Booking {
  id: string;
  status: BookingStatus;
  route: { from: string; to: string };
  date: string;
  departureTime: string;
  arrivalTime: string;
  seatCount: number;
  operator: string;
  amount: number;
  driver?: string;
}

export interface RiderUpcomingRide {
  id: string;
  driverName: string;
  rating: number;
  vehicle: string;
  badge: string;
  badgeTone: 'time' | 'day';
  from: string;
  to: string;
  eta: string;
}

export interface ActivePlan {
  id: string;
  route: string;
  schedule: string;
  progress: { current: number; total: number };
  driver: { name: string; initial: string };
  nextTrip: string;
  status: 'ongoing' | 'active';
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  initial: string;
}

export interface SavedPlace {
  id: string;
  label: string;
  address: string;
  type: 'home' | 'office' | 'other';
}

export interface WalletTransaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'credit' | 'debit';
  timestamp: string;
}

export interface PaymentMethodItem {
  id: string;
  type: 'wallet' | 'bkash' | 'bank' | 'visa';
  label: string;
  detail: string;
  balance?: number;
}

export interface MessageThread {
  id: string;
  bookingRef?: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  initial: string;
}

export interface ChatMessage {
  id: string;
  body: string;
  senderRole: 'rider' | 'operator' | 'system';
  createdAt: string;
  isMine: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  type: 'success' | 'promo' | 'warning' | 'info';
  unread: boolean;
}

export interface DriverSchedule {
  id: string;
  name: string;
  time: string;
  days: string;
  origin: string;
  destination: string;
  seatsFilled: number;
  totalSeats: number;
  riders: string[];
  status: 'active' | 'archived';
}

export interface DriverRider {
  id: string;
  name: string;
  initial: string;
  verified: boolean;
  plan: string;
  amount: number;
}

export type BadgeVariant =
  | 'active'
  | 'pending'
  | 'cancelled'
  | 'womens'
  | 'express'
  | 'success'
  | 'info';

export type PaymentMethod = 'wallet' | 'bkash' | 'bank' | 'card';

export type SeatStatus = 'available' | 'selected' | 'booked' | 'women';

export interface Seat {
  id: string;
  label: string;
  status: SeatStatus;
}
