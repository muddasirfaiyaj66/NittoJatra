import { apiClient } from '@/services/api.client';
import { ApiBooking, ApiPaginatedBookings, ApiRide } from '@/services/api.types';
import {
  mapApiBookingsToDriverRiders,
  mapApiRidesToDriverSchedules,
  summarizeDriverEarnings,
} from '@/services/driver.mappers';
import { DriverRider, DriverSchedule } from '@/types';
import { localDateKey } from '@/utils/captain-route';

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
  async getDashboard(date = localDateKey()): Promise<DriverDashboardData> {
    const [rides, bookingsResult] = await Promise.all([
      apiClient.get<ApiRide[]>('/rides/my', { date }, true),
      apiClient.get<ApiPaginatedBookings>(
        '/bookings/dashboard',
        { date, page: 1, limit: 50 },
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

  async publishRoute(input: {
    fromName: string;
    toName: string;
    departureTime: string;
    price: number;
    totalSeats: number;
    serviceType: 'ac' | 'non-ac' | 'women-special' | 'express';
  }): Promise<ApiRide> {
    return apiClient.post<ApiRide>('/rides/publish', input, true);
  },
};
