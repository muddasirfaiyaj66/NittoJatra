import { create } from 'zustand';
import { driverService, DriverDashboardData } from '@/services/driver.service';
import { DriverRider, DriverSchedule } from '@/types';

interface DriverStore extends DriverDashboardData {
  isLoading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

const initialState: DriverDashboardData = {
  schedules: [],
  riders: [],
  payout: 0,
  pending: 0,
  activeRiders: 0,
  transactions: [],
};

export const useDriverStore = create<DriverStore>((set) => ({
  ...initialState,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboard = await driverService.getDashboard();
      set({ ...dashboard, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
    }
  },
}));

export function useDriverSchedules(status?: 'active' | 'archived'): DriverSchedule[] {
  const schedules = useDriverStore((state) => state.schedules);
  if (!status) return schedules;
  return schedules.filter((schedule) => schedule.status === status);
}

export function useDriverRiders(): DriverRider[] {
  return useDriverStore((state) => state.riders);
}
