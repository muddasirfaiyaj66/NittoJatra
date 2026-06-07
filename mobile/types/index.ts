export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  gender?: Gender;
  memberSince: string;
  totalTrips: number;
  totalSpent: number;
  points: number;
}

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
  gender: Gender;
}

export interface DhakaLocation {
  id: string;
  name: string;
  nameEn: string;
  zone: string;
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
}

export interface SearchResult {
  id: string;
  operatorId: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  rating: number;
  type: ServiceType;
}

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  status: BookingStatus;
  route: { from: string; to: string };
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  operator: string;
  amount: number;
}

export type SeatStatus = 'available' | 'selected' | 'booked' | 'women';

export interface Seat {
  id: string;
  label: string;
  status: SeatStatus;
}

export type BadgeVariant =
  | 'active'
  | 'pending'
  | 'cancelled'
  | 'womens'
  | 'express'
  | 'success'
  | 'info';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'cash';
