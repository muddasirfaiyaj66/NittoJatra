import { apiClient } from '@/services/api.client';
import { ApiLocation, ApiRoute } from '@/services/api.types';

export const routeService = {
  async getAll(): Promise<ApiRoute[]> {
    return apiClient.get<ApiRoute[]>('/routes');
  },

  async search(fromId: string, toId: string): Promise<ApiRoute> {
    return apiClient.get<ApiRoute>('/routes/search', { fromId, toId });
  },

  async getById(id: string): Promise<ApiRoute> {
    return apiClient.get<ApiRoute>(`/routes/${id}`);
  },
};

export interface SavedZoneSummary {
  id: string;
  name: string;
  radius: string;
  rides: number;
}

export function buildZoneSummaries(
  locations: Array<Pick<ApiLocation, '_id' | 'nameEn' | 'zone'>>,
  routes: ApiRoute[],
): SavedZoneSummary[] {
  const zoneCounts = new Map<string, number>();

  for (const route of routes) {
    const zone = route.fromLocation.zone;
    zoneCounts.set(zone, (zoneCounts.get(zone) ?? 0) + 1);
  }

  const seen = new Set<string>();
  const summaries: SavedZoneSummary[] = [];

  for (const location of locations) {
    if (seen.has(location.zone)) continue;
    seen.add(location.zone);
    summaries.push({
      id: location._id,
      name: `${location.zone} Service Zone`,
      radius: '500m',
      rides: zoneCounts.get(location.zone) ?? 0,
    });
  }

  return summaries.slice(0, 12);
}
