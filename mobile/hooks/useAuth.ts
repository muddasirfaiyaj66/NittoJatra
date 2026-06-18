import { useAuthStore } from '@/store/auth.store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);
  const pickRole = useAuthStore((s) => s.pickRole);
  const setLoginRole = useAuthStore((s) => s.setLoginRole);
  const logout = useAuthStore((s) => s.logout);
  const clearError = useAuthStore((s) => s.clearError);
  const updateUser = useAuthStore((s) => s.updateUser);

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    hasHydrated,
    error,
    login,
    register,
    loginAsGuest,
    pickRole,
    setLoginRole,
    logout,
    clearError,
    updateUser,
  };
}
