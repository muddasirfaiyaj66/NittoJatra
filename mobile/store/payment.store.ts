import { create } from 'zustand';

export type PaymentStep = 'method' | 'details' | 'pin' | 'otp' | 'transfer' | 'done';

interface PaymentStore {
  step: PaymentStep;
  total: number;
  rideId: string | null;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cash';
  selectedSeats: string[];
  setTotal: (total: number) => void;
  setRideId: (id: string) => void;
  setPaymentMethod: (method: PaymentStore['paymentMethod']) => void;
  setSelectedSeats: (seats: string[]) => void;
  setStep: (step: PaymentStep) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  step: 'method',
  total: 0,
  rideId: null,
  paymentMethod: 'bkash',
  selectedSeats: [],
  setTotal: (total) => set({ total }),
  setRideId: (rideId) => set({ rideId }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setSelectedSeats: (selectedSeats) => set({ selectedSeats }),
  setStep: (step) => set({ step }),
  reset: () =>
    set({
      step: 'method',
      total: 0,
      rideId: null,
      paymentMethod: 'bkash',
      selectedSeats: [],
    }),
}));
