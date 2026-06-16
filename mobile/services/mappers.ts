import {
  ApiBooking,
  ApiLocation,
  ApiOperator,
  ApiRide,
  ApiUser,
} from '@/services/api.types';
import {
  Booking,
  BookingStatus,
  DhakaLocation,
  Gender,
  Operator,
  RideDetail,
  RiderUpcomingRide,
  SearchResult,
  ServiceType,
  User,
  UserRole,
} from '@/types';
import { geoJsonToLatLng } from '@/utils/location-coords';

const SERVICE_TYPE_MAP: Record<string, ServiceType> = {
  ac: 'AC',
  'non-ac': 'Non-AC',
  'women-special': 'Women Special',
  express: 'Express',
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function mapBackendRole(role: string, clientRole: UserRole): UserRole {
  if (role === 'operator') {
    return 'driver';
  }
  return clientRole;
}

function mapTier(points: number): User['tier'] {
  if (points >= 500) return 'GOLD';
  if (points >= 200) return 'SILVER';
  return 'BRONZE';
}

export function mapApiUser(apiUser: ApiUser, clientRole: UserRole = 'rider'): User {
  const role = mapBackendRole(apiUser.role, clientRole);
  return {
    id: apiUser._id,
    name: apiUser.fullName,
    email: apiUser.email,
    phone: apiUser.phone,
    avatar: null,
    gender: apiUser.gender as Gender,
    role,
    memberSince: apiUser.createdAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    totalTrips: apiUser.totalTrips,
    totalSpent: apiUser.totalSpent,
    points: apiUser.loyaltyPoints,
    rating: 5,
    tier: role === 'rider' ? mapTier(apiUser.loyaltyPoints) : undefined,
    co2Saved: role === 'rider' ? '0kg' : undefined,
    activePlans: role === 'rider' ? 0 : undefined,
    savedLocation: role === 'rider' ? 'Dhaka, Bangladesh' : undefined,
    emergencyContact: apiUser.phone,
    driverBalance: role === 'driver' ? 0 : undefined,
    activeRiders: role === 'driver' ? 0 : undefined,
  };
}

export function mapApiLocation(location: ApiLocation): DhakaLocation {
  const latLng = geoJsonToLatLng(location.coordinates);
  return {
    id: location._id,
    name: location.name,
    nameEn: location.nameEn,
    zone: location.zone,
    latitude: latLng?.[0],
    longitude: latLng?.[1],
  };
}

export function mapApiOperator(operator: ApiOperator): Operator {
  return {
    id: operator._id,
    name: operator.name,
    rating: operator.rating,
    type: SERVICE_TYPE_MAP[operator.primaryType] ?? 'AC',
    color: operator.brandColor,
  };
}

export function mapApiRideToSearchResult(ride: ApiRide): SearchResult {
  const availableSeats =
    ride.seatMap?.filter((s) => s.status === 'available' || s.status === 'women-only')
      .length ??
    ride.totalSeats;

  return {
    id: ride._id,
    operatorId: ride.operator._id,
    operatorName: ride.operator.name,
    operatorColor: ride.operator.brandColor,
    from: ride.route.fromLocation.nameEn,
    to: ride.route.toLocation.nameEn,
    departure: formatTime(ride.departureTime),
    arrival: formatTime(ride.arrivalTime),
    duration: formatDuration(ride.route.estimatedMinutes),
    price: ride.price,
    seatsAvailable: availableSeats,
    rating: ride.operator.rating,
    type: SERVICE_TYPE_MAP[ride.serviceType] ?? 'AC',
    womenOnly: ride.serviceType === 'women-special',
    distance: `${ride.route.distanceKm} km`,
  };
}

export function mapApiRideToDetail(ride: ApiRide): RideDetail {
  const search = mapApiRideToSearchResult(ride);
  return {
    ...search,
    routeName: `${ride.route.fromLocation.nameEn} → ${ride.route.toLocation.nameEn}`,
    badge: ride.serviceType.toUpperCase(),
    slot: formatTime(ride.departureTime),
    facilities: ['AC', 'Verified Driver', 'Live Tracking'],
    stops: [
      {
        name: ride.route.fromLocation.nameEn,
        label: 'Pickup',
        time: formatTime(ride.departureTime),
      },
      {
        name: ride.route.toLocation.nameEn,
        label: 'Drop-off',
        time: formatTime(ride.arrivalTime),
      },
    ],
    reviews: [],
    subscriptionPlans: [
      {
        id: 'single',
        name: 'Single Trip',
        price: ride.price,
        discount: 0,
        selected: true,
      },
    ],
  };
}

function mapBookingStatus(status: string): BookingStatus {
  switch (status) {
    case 'confirmed':
      return 'upcoming';
    case 'pending':
      return 'upcoming';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'upcoming';
  }
}

export function mapApiBooking(booking: ApiBooking): Booking {
  return {
    id: booking.bookingId,
    status: mapBookingStatus(booking.status),
    route: {
      from: booking.ride.route.fromLocation.nameEn,
      to: booking.ride.route.toLocation.nameEn,
    },
    date: booking.ride.departureTime.slice(0, 10),
    departureTime: formatTime(booking.ride.departureTime),
    arrivalTime: formatTime(booking.ride.arrivalTime),
    seatCount: booking.seats.length,
    operator: booking.ride.operator.name,
    amount: booking.totalAmount,
    driver: `${booking.ride.operator.name} Captain`,
  };
}

export function mapBookingToUpcomingRide(booking: Booking): RiderUpcomingRide {
  return {
    id: booking.id,
    driverName: booking.driver ?? `${booking.operator} Captain`,
    rating: 4.9,
    vehicle: `${booking.operator} Service`,
    badge: booking.departureTime,
    badgeTone: 'time',
    from: booking.route.from,
    to: booking.route.to,
    eta: `Departs ${booking.departureTime}`,
  };
}

export function normalizeLocationQuery(value: string): string {
  return value.trim().toLowerCase();
}

export function matchLocationByName(
  locations: DhakaLocation[],
  query: string,
): DhakaLocation | undefined {
  const normalized = normalizeLocationQuery(query);
  return locations.find(
    (loc) =>
      normalizeLocationQuery(loc.nameEn) === normalized ||
      normalizeLocationQuery(loc.name) === normalized ||
      normalizeLocationQuery(loc.nameEn).includes(normalized) ||
      normalized.includes(normalizeLocationQuery(loc.nameEn)),
  );
}
