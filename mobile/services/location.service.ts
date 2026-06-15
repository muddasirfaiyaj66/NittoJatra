import { apiClient } from '@/services/api.client';
import { ApiLocation } from '@/services/api.types';
import { mapApiLocation } from '@/services/mappers';
import { DhakaLocation } from '@/types';

export const locationService = {
  async getAll(): Promise<DhakaLocation[]> {
    const locations = await apiClient.get<ApiLocation[]>('/locations');
    return locations.map(mapApiLocation);
  },

  async search(query: string): Promise<DhakaLocation[]> {
    const locations = await apiClient.get<ApiLocation[]>('/locations/search', { q: query });
    return locations.map(mapApiLocation);
  },

  async getById(id: string): Promise<DhakaLocation> {
    const location = await apiClient.get<ApiLocation>(`/locations/${id}`);
    return mapApiLocation(location);
  },
};
