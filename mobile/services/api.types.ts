export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ApiAuthPayload {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

export interface ApiUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  isActive: boolean;
  totalTrips: number;
  totalSpent: number;
  loyaltyPoints: number;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  emergencyContact?: string;
  emergencyContactEmail?: string;
  walletBalance?: number;
  walletTransactions?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiLocation {
  _id: string;
  name: string;
  nameEn: string;
  zone: string;
  coordinates?: {
    type: string;
    coordinates: [number, number];
  };
}

export interface ApiOperator {
  _id: string;
  name: string;
  code: string;
  brandColor: string;
  rating: number;
  primaryType: string;
  serviceTypes: string[];
}

export interface ApiRoute {
  _id: string;
  fromLocation: ApiLocation;
  toLocation: ApiLocation;
  distanceKm: number;
  estimatedMinutes: number;
  basePrice: number;
}

export interface ApiSeat {
  seatNumber: string;
  row: number;
  column: number;
  status: 'available' | 'booked' | 'women-only' | 'blocked';
}

export interface ApiRide {
  _id: string;
  route: ApiRoute;
  operator: ApiOperator;
  departureTime: string;
  arrivalTime: string;
  serviceType: string;
  totalSeats: number;
  price: number;
  seatMap?: ApiSeat[];
  status: string;
  driverUserId?: string;
}

export interface ApiBooking {
  _id: string;
  bookingId: string;
  ride: ApiRide;
  seats: string[];
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  baseFare: number;
  convenienceFee: number;
  discount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  promoCode?: string;
  createdAt?: string;
}

export interface ApiPaginatedBookings {
  data: ApiBooking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiHealth {
  status: string;
  mongo: string;
  uptime: number;
}

export interface ApiConversation {
  _id: string;
  bookingRef: string;
  title: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  online: boolean;
}

export interface ApiMessage {
  _id: string;
  senderRole: 'rider' | 'operator' | 'system' | string;
  body: string;
  createdAt?: string;
}

export interface ApiPaginatedMessages {
  data: ApiMessage[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
