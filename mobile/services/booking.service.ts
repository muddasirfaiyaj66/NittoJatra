import { bookingApiService } from '@/services/ride.service';

export interface CreateBookingInput {
  rideId: string;
  seats: string[];
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  paymentMethod: string;
  promoCode?: string;
}

export const bookingService = {
  createBooking(input: CreateBookingInput) {
    return bookingApiService.createBooking(input);
  },

  getMyBookings(status?: string) {
    return bookingApiService.getMyBookings(status);
  },

  cancelBooking(bookingId: string, reason: string) {
    return bookingApiService.cancelBooking(bookingId, reason);
  },

  confirmPayment(bookingId: string) {
    return bookingApiService.confirmPayment(bookingId);
  },

  submitReview(bookingId: string, rating: number, comment?: string) {
    return bookingApiService.submitReview(bookingId, rating, comment);
  },
};
