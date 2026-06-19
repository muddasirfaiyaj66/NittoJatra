import { ApiBooking, ApiRide } from '@/services/api.types';
import { DriverRider, DriverSchedule } from '@/types';

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function countFilledSeats(ride: ApiRide): number {
  if (!ride.seatMap?.length) {
    return 0;
  }
  return ride.seatMap.filter((seat) => seat.status === 'booked').length;
}

export function mapApiRidesToDriverSchedules(
  rides: ApiRide[],
  bookings: ApiBooking[],
): DriverSchedule[] {
  return rides.map((ride) => {
    const rideBookings = bookings.filter((booking) => booking.ride._id === ride._id);
    const filled = Math.max(countFilledSeats(ride), rideBookings.length);

    return {
      id: ride._id,
      name: `${ride.route.fromLocation.nameEn} Commute`,
      time: formatTime(ride.departureTime),
      days: 'TODAY',
      origin: ride.route.fromLocation.nameEn,
      destination: ride.route.toLocation.nameEn,
      seatsFilled: filled,
      totalSeats: ride.totalSeats,
      riders: rideBookings.map((booking) =>
        booking.passengerName.trim().charAt(0).toUpperCase(),
      ),
      status: ride.status === 'cancelled' ? 'archived' : 'active',
    };
  });
}

export function mapApiBookingsToDriverRiders(bookings: ApiBooking[]): DriverRider[] {
  return bookings.map((booking) => ({
    id: booking.bookingId,
    name: booking.passengerName,
    initial: booking.passengerName.trim().charAt(0).toUpperCase(),
    verified: booking.paymentStatus === 'paid',
    plan: booking.status === 'confirmed' ? 'Confirmed' : booking.status,
    amount: booking.totalAmount,
    passengerUserId: booking.user?._id,
    bookingDbId: booking._id,
  }));
}

export function summarizeDriverEarnings(bookings: ApiBooking[]) {
  const paid = bookings.filter((booking) => booking.paymentStatus === 'paid');
  const pendingBookings = bookings.filter((booking) => booking.paymentStatus !== 'paid');

  const payout = paid.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const pending = pendingBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  const transactions = bookings.slice(0, 10).map((booking) => ({
    id: booking.bookingId,
    title: `${booking.ride.route.fromLocation.nameEn} → ${booking.ride.route.toLocation.nameEn}`,
    subtitle: booking.passengerName,
    amount: booking.totalAmount,
    type: booking.paymentStatus === 'paid' ? ('credit' as const) : ('debit' as const),
  }));

  return { payout, pending, transactions };
}
