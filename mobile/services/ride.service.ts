import { apiClient } from '@/services/api.client';
import { ApiBooking, ApiHealth, ApiOperator, ApiPaginatedBookings, ApiRide, ApiSeat } from '@/services/api.types';
import { mapApiBooking, mapApiOperator, mapApiRideToDetail, mapApiRideToSearchResult } from '@/services/mappers';
import { Booking, Operator, RideDetail, SearchResult } from '@/types';
import { localDateKey } from '@/utils/captain-route';

export const rideService = {
  async checkHealth(): Promise<ApiHealth> {
    return apiClient.get<ApiHealth>('/health');
  },

  async searchRides(
    from: string,
    to: string,
    date = localDateKey(),
    serviceType?: string,
  ): Promise<SearchResult[]> {
    const rides = await apiClient.get<ApiRide[]>('/rides/search', {
      fromName: from.trim(),
      toName: to.trim(),
      date,
      serviceType,
    });
    return rides.map(mapApiRideToSearchResult);
  },

  async getRideById(id: string): Promise<RideDetail> {
    const ride = await apiClient.get<ApiRide>(`/rides/${id}`);
    return mapApiRideToDetail(ride);
  },

  async getSeatMap(rideId: string): Promise<ApiSeat[]> {
    const result = await apiClient.get<{ seats: ApiSeat[]; availableCount: number }>(
      `/rides/${rideId}/seats`,
    );
    return result.seats;
  },

  async getOperators(): Promise<Operator[]> {
    const operators = await apiClient.get<ApiOperator[]>('/operators');
    return operators.map(mapApiOperator);
  },

  async getOperatorById(id: string): Promise<Operator> {
    const operator = await apiClient.get<ApiOperator>(`/operators/${id}`);
    return mapApiOperator(operator);
  },
};

export const bookingApiService = {
  async createBooking(input: {
    rideId: string;
    seats: string[];
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    paymentMethod: string;
    promoCode?: string;
  }): Promise<Booking> {
    const booking = await apiClient.post<ApiBooking>('/bookings', input, true);
    return mapApiBooking(booking);
  },

  async getMyBookings(status?: string): Promise<Booking[]> {
    const result = await apiClient.get<ApiPaginatedBookings>(
      '/bookings',
      { status, page: 1, limit: 50 },
      true,
    );
    return result.data.map(mapApiBooking);
  },

  async getBookingById(bookingId: string): Promise<Booking> {
    const booking = await apiClient.get<ApiBooking>(`/bookings/${bookingId}`, undefined, true);
    return mapApiBooking(booking);
  },

  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    const booking = await apiClient.patch<ApiBooking>(
      `/bookings/${bookingId}/cancel`,
      { cancellationReason: reason },
      true,
    );
    return mapApiBooking(booking);
  },

  async submitReview(
    bookingId: string,
    rating: number,
    comment?: string,
  ): Promise<any> {
    return apiClient.post(
      `/bookings/${bookingId}/review`,
      { rating, comment },
      true,
    );
  },

  async confirmPayment(bookingId: string): Promise<Booking> {
    const booking = await apiClient.patch<ApiBooking>(
      `/bookings/${bookingId}/confirm-payment`,
      undefined,
      true,
    );
    return mapApiBooking(booking);
  },
};
