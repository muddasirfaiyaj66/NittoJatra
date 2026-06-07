import { Booking, BookingStatus } from '@/types';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

let counter = 100;

export interface CreateBookingInput {
  route: { from: string; to: string };
  date: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  operator: string;
  amount: number;
}

export const bookingService = {
  generateBookingId(): string {
    counter += 1;
    const year = new Date().getFullYear();
    return `BK-${year}-${String(counter).padStart(3, '0')}`;
  },

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    await delay(1200);
    return {
      id: this.generateBookingId(),
      status: 'upcoming' as BookingStatus,
      ...input,
    };
  },
};
