import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import { RegisterData, User, UserRole } from '@/types';

interface AuthStore {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginAsGuest: (role?: UserRole) => Promise<void>;
  /** Welcome flow — clears any stale session and sets intended role */
  pickRole: (role: UserRole) => void;
  /** Login/register toggle — updates role only, never clears an active session */
  setLoginRole: (role: UserRole) => void;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (value: boolean) => void;
  updateUser: (patch: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      role: 'rider',
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,
      error: null,

      login: async (email, password, role = 'rider') => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.login(email, password, role);
          set({
            user,
            role: user.role,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (e) {
          set({ isLoading: false, error: (e as Error).message });
          throw e;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.register(data);
          set({
            user: { ...user, role: data.role },
            role: data.role,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (e) {
          set({ isLoading: false, error: (e as Error).message });
          throw e;
        }
      },

      loginAsGuest: async (role = 'rider') => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.loginAsGuest(role);
          set({ user, role: user.role, isAuthenticated: true, isLoading: false });
        } catch (e) {
          set({ isLoading: false, error: (e as Error).message });
          throw e;
        }
      },

      pickRole: (role) =>
        set({
          role,
          user: null,
          isAuthenticated: false,
          error: null,
        }),
      setLoginRole: (role) => set({ role }),
      logout: () =>
        set({
          user: null,
          role: 'rider',
          isAuthenticated: false,
          error: null,
        }),
      clearError: () => set({ error: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),

      updateUser: async (patch) => {
        const current = useAuthStore.getState().user;
        if (!current) return;
        const updated = await authService.updateUser(current, patch);
        set({ user: updated });
      },
    }),
    {
      name: 'nittojatra-auth-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Auth store rehydration failed:', error);
        }
        if (state?.user?.role && state.role !== state.user.role) {
          useAuthStore.setState({ role: state.user.role });
        }
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);
