import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { bookingService } from '@/services/booking.service';
import { Booking, BookingStatus } from '@/types';

interface BookingStore {
  bookings: Booking[];
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => Promise<void>;
  getByStatus: (status: BookingStatus) => Booking[];
  setHasHydrated: (value: boolean) => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],
      hasHydrated: false,
      isLoading: false,
      error: null,

      fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
          const bookings = await bookingService.getMyBookings();
          set({ bookings, isLoading: false });
        } catch (e) {
          set({ isLoading: false, error: (e as Error).message });
        }
      },

      addBooking: (booking) =>
        set((state) => ({ bookings: [booking, ...state.bookings] })),

      cancelBooking: async (id) => {
        const updated = await bookingService.cancelBooking(id, 'Cancelled by user');
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        }));
      },

      getByStatus: (status) => get().bookings.filter((b) => b.status === status),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'nittojatra-bookings-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ bookings: state.bookings }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
