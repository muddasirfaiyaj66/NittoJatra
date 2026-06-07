import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Lang } from '@/constants/strings';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsStore {
  language: Lang;
  notifications: boolean;
  themeMode: ThemeMode;
  hasHydrated: boolean;
  setLanguage: (lang: Lang) => void;
  toggleLanguage: () => void;
  setNotifications: (value: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      notifications: true,
      themeMode: 'system',
      hasHydrated: false,

      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set({ language: get().language === 'en' ? 'bn' : 'en' }),
      setNotifications: (notifications) => set({ notifications }),
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleDarkMode: () =>
        set({ themeMode: get().themeMode === 'dark' ? 'light' : 'dark' }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'nittojatra-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        notifications: state.notifications,
        themeMode: state.themeMode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
