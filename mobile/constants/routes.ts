import type { Href } from 'expo-router';

export const ROUTES = {
  riderTabs: '/(tabs)' as Href,
  driverTabs: '/(driver)/(tabs)' as Href,
  driverPostRoute: '/(driver)/post-route' as Href,
  welcome: '/(auth)/welcome' as Href,
} as const;
