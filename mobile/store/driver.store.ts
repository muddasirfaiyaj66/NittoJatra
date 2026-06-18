import { create } from 'zustand';
import { ApiRide } from '@/services/api.types';
import { driverService, DriverDashboardData } from '@/services/driver.service';
import { mapApiRidesToDriverSchedules } from '@/services/driver.mappers';
import { DriverRider, DriverSchedule } from '@/types';

interface DriverStore extends DriverDashboardData {
  isLoading: boolean;
  error: string | null;
  fetchDashboard: (date?: string) => Promise<void>;
  upsertPublishedRide: (ride: ApiRide) => void;
}

const initialState: DriverDashboardData = {
  schedules: [],
  riders: [],
  payout: 0,
  pending: 0,
  activeRiders: 0,
  transactions: [],
};

function mergeSchedules(existing: DriverSchedule[], incoming: DriverSchedule[]): DriverSchedule[] {
  const byId = new Map<string, DriverSchedule>();
  for (const schedule of existing) {
    byId.set(schedule.id, schedule);
  }
  for (const schedule of incoming) {
    byId.set(schedule.id, schedule);
  }
  return Array.from(byId.values());
}

export const useDriverStore = create<DriverStore>((set) => ({
  ...initialState,
  isLoading: false,
  error: null,

  fetchDashboard: async (date?: string) => {
    set({ isLoading: true, error: null });
    try {
      const dashboard = await driverService.getDashboard(date);
      set((state) => ({
        ...dashboard,
        schedules: mergeSchedules(state.schedules, dashboard.schedules),
        isLoading: false,
      }));
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
    }
  },

  upsertPublishedRide: (ride) => {
    const [schedule] = mapApiRidesToDriverSchedules([ride], []);
    if (!schedule) {
      return;
    }
    set((state) => ({
      schedules: mergeSchedules([schedule], state.schedules),
    }));
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
