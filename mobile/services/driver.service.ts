import { apiClient } from '@/services/api.client';
import { ApiBooking, ApiPaginatedBookings, ApiRide } from '@/services/api.types';
import {
  mapApiBookingsToDriverRiders,
  mapApiRidesToDriverSchedules,
  summarizeDriverEarnings,
} from '@/services/driver.mappers';
import { DriverRider, DriverSchedule } from '@/types';

export interface DriverDashboardData {
  schedules: DriverSchedule[];
  riders: DriverRider[];
  payout: number;
  pending: number;
  activeRiders: number;
  transactions: Array<{
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    type: 'credit' | 'debit';
  }>;
}

export const driverService = {
  async getDashboard(): Promise<DriverDashboardData> {
    const today = new Date().toISOString().slice(0, 10);
    const [rides, bookingsResult] = await Promise.all([
      apiClient.get<ApiRide[]>('/rides/today', { date: today }),
      apiClient.get<ApiPaginatedBookings>(
        '/bookings/dashboard',
        { date: today, page: 1, limit: 50 },
        true,
      ),
    ]);

    const bookings = bookingsResult.data as ApiBooking[];
    const schedules = mapApiRidesToDriverSchedules(rides, bookings);
    const riders = mapApiBookingsToDriverRiders(bookings);
    const earnings = summarizeDriverEarnings(bookings);

    return {
      schedules,
      riders,
      payout: earnings.payout,
      pending: earnings.pending,
      activeRiders: riders.length,
      transactions: earnings.transactions,
    };
  },
};
