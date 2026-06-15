import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * API base URL — set in mobile/.env as EXPO_PUBLIC_API_URL
 *
 * Physical phone (Expo Go): use your PC LAN IP, e.g. http://192.168.0.103:3000/api/v1
 * Android emulator:          http://10.0.2.2:3000/api/v1
 * iOS simulator:             http://localhost:3000/api/v1
 *
 * After editing .env, restart Expo: npx expo start -c
 */
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const fromEnv =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined);

export const API_BASE_URL =
  fromEnv && fromEnv.trim().length > 0
    ? fromEnv.trim().replace(/\/$/, '')
    : `http://${defaultHost}:3000/api/v1`;
