import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Colors, DarkColors } from '@/constants/theme';
import { useSettingsStore, ThemeMode } from '@/store/settings.store';

export type ThemeColors = Record<keyof typeof Colors, string>;

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: Colors,
  isDark: false,
  mode: 'system',
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const mode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);

  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';
  const colors: ThemeColors = isDark ? DarkColors : Colors;

  const setMode = useCallback((m: ThemeMode) => setThemeMode(m), [setThemeMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ colors, isDark, mode, setMode }),
    [colors, isDark, mode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

type NamedStyles<T> = { [P in keyof T]: object };

export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (colors: ThemeColors, isDark: boolean) => T,
): T {
  const { colors, isDark } = useTheme();
  return useMemo(() => StyleSheet.create(factory(colors, isDark)), [colors, isDark, factory]);
}
