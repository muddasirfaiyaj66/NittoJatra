import { create } from 'zustand';

export type PaymentStep = 'method' | 'details' | 'pin' | 'otp' | 'transfer' | 'done';

interface PaymentStore {
  step: PaymentStep;
  total: number;
  originalTotal: number;
  rideId: string | null;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cash';
  selectedSeats: string[];
  claimedCoins: number;
  coinDiscount: number;
  promoCode: string;
  promoDiscount: number;
  setTotal: (total: number) => void;
  setOriginalTotal: (total: number) => void;
  setRideId: (id: string) => void;
  setPaymentMethod: (method: PaymentStore['paymentMethod']) => void;
  setSelectedSeats: (seats: string[]) => void;
  setStep: (step: PaymentStep) => void;
  setClaimedCoins: (coins: number, discount: number) => void;
  setPromoCode: (code: string, discount: number) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  step: 'method',
  total: 0,
  originalTotal: 0,
  rideId: null,
  paymentMethod: 'bkash',
  selectedSeats: [],
  claimedCoins: 0,
  coinDiscount: 0,
  promoCode: '',
  promoDiscount: 0,
  setTotal: (total) => set({ total }),
  setOriginalTotal: (originalTotal) => set({ originalTotal }),
  setRideId: (rideId) => set({ rideId }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setSelectedSeats: (selectedSeats) => set({ selectedSeats }),
  setStep: (step) => set({ step }),
  setClaimedCoins: (claimedCoins, coinDiscount) => set({ claimedCoins, coinDiscount }),
  setPromoCode: (promoCode, promoDiscount) => set({ promoCode, promoDiscount }),
  reset: () =>
    set({
      step: 'method',
      total: 0,
      originalTotal: 0,
      rideId: null,
      paymentMethod: 'bkash',
      selectedSeats: [],
      claimedCoins: 0,
      coinDiscount: 0,
      promoCode: '',
      promoDiscount: 0,
    }),
}));
