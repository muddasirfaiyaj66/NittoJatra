import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'nittojatra-recent-places-v1';
const MAX_RECENT = 8;

export interface RecentPlace {
  id: string;
  name: string;
  label: string;
}

export const recentPlacesService = {
  async getAll(): Promise<RecentPlace[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as RecentPlace[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async add(name: string, label = 'Recent search'): Promise<RecentPlace[]> {
    const trimmed = name.trim();
    if (!trimmed) return this.getAll();

    const existing = await this.getAll();
    const next: RecentPlace[] = [
      { id: `${Date.now()}`, name: trimmed, label },
      ...existing.filter((place) => place.name.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, MAX_RECENT);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  },
};
