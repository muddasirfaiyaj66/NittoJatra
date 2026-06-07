import { MOCK_USER } from '@/constants/mock-data';
import { RegisterData, User } from '@/types';

const DEMO_EMAIL = 'demo@nittojatra.com';
const DEMO_PASSWORD = 'demo1234';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await delay(900);
    const normalized = email.trim().toLowerCase();
    if (normalized === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return { ...MOCK_USER };
    }
    throw new Error('Invalid email or password. Try demo@nittojatra.com / demo1234');
  },

  async register(data: RegisterData): Promise<User> {
    await delay(1000);
    if (!data.email || !data.password || !data.name) {
      throw new Error('Please fill in all required fields.');
    }
    return {
      ...MOCK_USER,
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      gender: data.gender,
      memberSince: new Date().toISOString().slice(0, 10),
      totalTrips: 0,
      totalSpent: 0,
      points: 0,
    };
  },

  async loginAsGuest(): Promise<User> {
    await delay(400);
    return {
      ...MOCK_USER,
      id: 'guest',
      name: 'Guest User',
      email: 'guest@nittojatra.com',
    };
  },
};
