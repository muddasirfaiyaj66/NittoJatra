import { MOCK_DRIVER, MOCK_USER } from '@/constants/mock-data';
import { RegisterData, User, UserRole } from '@/types';

const DEMO_EMAIL = 'demo@nittojatra.com';
const DEMO_PASSWORD = 'demo1234';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string, role: UserRole = 'rider'): Promise<User> {
    await delay(900);
    const normalized = email.trim().toLowerCase();
    if (normalized === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const base = role === 'driver' ? MOCK_DRIVER : MOCK_USER;
      return { ...base, email: normalized };
    }
    throw new Error('Invalid email or password. Try demo@nittojatra.com / demo1234');
  },

  async register(data: RegisterData): Promise<User> {
    await delay(1000);
    if (!data.email || !data.password || !data.name) {
      throw new Error('Please fill in all required fields.');
    }
    const base = data.role === 'driver' ? MOCK_DRIVER : MOCK_USER;
    return {
      ...base,
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      gender: data.gender,
      role: data.role,
      memberSince: new Date().toISOString().slice(0, 10),
      totalTrips: 0,
      totalSpent: 0,
      points: data.role === 'rider' ? 0 : base.points,
    };
  },

  async loginAsGuest(role: UserRole = 'rider'): Promise<User> {
    await delay(400);
    const base = role === 'driver' ? MOCK_DRIVER : MOCK_USER;
    return {
      ...base,
      id: 'guest',
      name: role === 'driver' ? 'Guest Captain' : 'Guest User',
      email: 'guest@nittojatra.com',
      role,
    };
  },
};
