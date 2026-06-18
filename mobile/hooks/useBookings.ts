import { useMemo } from 'react';
import { useBookingStore } from '@/store/booking.store';
import { BookingStatus } from '@/types';

export function useBookings(status?: BookingStatus) {
  const bookings = useBookingStore((s) => s.bookings);
  const addBooking = useBookingStore((s) => s.addBooking);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  const filtered = useMemo(
    () => (status ? bookings.filter((b) => b.status === status) : bookings),
    [bookings, status],
  );

  return { bookings: filtered, allBookings: bookings, addBooking, cancelBooking };
}
