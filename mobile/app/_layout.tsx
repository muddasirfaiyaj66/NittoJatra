import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import {
  NotoSansBengali_400Regular,
  NotoSansBengali_700Bold,
} from '@expo-google-fonts/noto-sans-bengali';
import { ToastProvider } from '@/components/shared/Toast';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';
import { useAuthStore } from '@/store/auth.store';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { colors, isDark } = useTheme();

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          primary: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          primary: colors.primary,
        },
      };

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="rider" />
          <Stack.Screen name="captain" />
          <Stack.Screen name="ride/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="ride/results" options={{ presentation: 'card' }} />
          <Stack.Screen name="ride/live-tracking" options={{ presentation: 'card' }} />
          <Stack.Screen name="ride/subscription-tracker" options={{ presentation: 'card' }} />
          <Stack.Screen name="wallet" options={{ presentation: 'card' }} />
          <Stack.Screen name="personal-details" options={{ presentation: 'card' }} />
          <Stack.Screen name="messages/index" options={{ presentation: 'card' }} />
          <Stack.Screen name="messages/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
          <Stack.Screen name="account-security" options={{ presentation: 'card' }} />
          <Stack.Screen name="refer-earn" options={{ presentation: 'card' }} />
          <Stack.Screen name="saved-zones" options={{ presentation: 'card' }} />
          <Stack.Screen name="modals" options={{ presentation: 'modal' }} />
        </Stack>
      </ToastProvider>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    NotoSansBengali_400Regular,
    NotoSansBengali_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const markHydrated = () => useAuthStore.setState({ hasHydrated: true });
    if (useAuthStore.persist.hasHydrated()) {
      markHydrated();
    }
    return useAuthStore.persist.onFinishHydration(markHydrated);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
