import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MOCK_BOOKINGS } from '@/constants/mock-data';
import { Booking, BookingStatus } from '@/types';

interface BookingStore {
  bookings: Booking[];
  hasHydrated: boolean;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  getByStatus: (status: BookingStatus) => Booking[];
  setHasHydrated: (value: boolean) => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: MOCK_BOOKINGS,
      hasHydrated: false,

      addBooking: (booking) =>
        set((state) => ({ bookings: [booking, ...state.bookings] })),

      cancelBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b,
          ),
        })),

      getByStatus: (status) => get().bookings.filter((b) => b.status === status),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'nittojatra-bookings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ bookings: state.bookings }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
