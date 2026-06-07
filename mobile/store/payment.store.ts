import { create } from 'zustand';

export type PaymentStep = 'method' | 'details' | 'pin' | 'otp' | 'transfer' | 'done';

interface PaymentStore {
  step: PaymentStep;
  total: number;
  rideId: string | null;
  setTotal: (total: number) => void;
  setRideId: (id: string) => void;
  setStep: (step: PaymentStep) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  step: 'method',
  total: 0,
  rideId: null,
  setTotal: (total) => set({ total }),
  setRideId: (rideId) => set({ rideId }),
  setStep: (step) => set({ step }),
  reset: () => set({ step: 'method', total: 0, rideId: null }),
}));
