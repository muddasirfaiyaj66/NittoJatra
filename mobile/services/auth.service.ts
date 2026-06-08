import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_DRIVER, MOCK_USER } from '@/constants/mock-data';
import { RegisterData, User, UserRole } from '@/types';

const DEMO_EMAIL = 'demo@nittojatra.com';
const DEMO_RIDER_EMAIL = 'rider@nittojatra.com';
const DEMO_CAPTAIN_EMAIL = 'captain@nittojatra.com';
const DEMO_PASSWORD = 'demo1234';
const USERS_STORAGE_KEY = 'nittojatra-registered-users';

const FIXED_ROLE_EMAILS: Record<string, UserRole> = {
  [DEMO_RIDER_EMAIL]: 'rider',
  [DEMO_CAPTAIN_EMAIL]: 'driver',
};

interface StoredCredential {
  user: User;
  password: string;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function readStoredUsers(): Promise<StoredCredential[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredCredential[];
  } catch {
    return [];
  }
}

async function writeStoredUsers(users: StoredCredential[]): Promise<void> {
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function profileForRole(role: UserRole, overrides: Partial<User>): User {
  const base = role === 'driver' ? { ...MOCK_DRIVER } : { ...MOCK_USER };
  return { ...base, ...overrides, role };
}

function resolveLoginRole(email: string, selectedRole: UserRole): UserRole {
  return FIXED_ROLE_EMAILS[email] ?? selectedRole;
}

function isDemoPassword(password: string): boolean {
  return password === DEMO_PASSWORD;
}

function isDemoEmail(email: string): boolean {
  return (
    email === DEMO_EMAIL ||
    email === DEMO_RIDER_EMAIL ||
    email === DEMO_CAPTAIN_EMAIL
  );
}

export const DEMO_CREDENTIALS = {
  rider: { email: DEMO_RIDER_EMAIL, password: DEMO_PASSWORD },
  captain: { email: DEMO_CAPTAIN_EMAIL, password: DEMO_PASSWORD },
  either: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
} as const;

export const authService = {
  async login(email: string, password: string, role: UserRole = 'rider'): Promise<User> {
    await delay(700);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      throw new Error('Please enter your email and password.');
    }

    const effectiveRole = resolveLoginRole(normalizedEmail, role);

    // Demo accounts — rider/captain emails always return the matching profile
    if (isDemoEmail(normalizedEmail) && isDemoPassword(password)) {
      return profileForRole(effectiveRole, { email: normalizedEmail });
    }

    // Registered users stored locally after sign-up
    const stored = await readStoredUsers();
    const match = stored.find(
      (entry) => entry.user.email.toLowerCase() === normalizedEmail && entry.password === password,
    );

    if (match) {
      if (match.user.role !== effectiveRole) {
        throw new Error(
          effectiveRole === 'driver'
            ? 'This email is registered as a Rider. Switch to Rider or create a Captain account.'
            : 'This email is registered as a Captain. Switch to Driver or sign in as Captain.',
        );
      }
      return { ...match.user, role: effectiveRole };
    }

    throw new Error(
      'Invalid email or password. Try rider@nittojatra.com or captain@nittojatra.com with demo1234.',
    );
  },

  async register(data: RegisterData): Promise<User> {
    await delay(900);

    if (!data.email?.trim() || !data.password || !data.name?.trim()) {
      throw new Error('Please fill in all required fields.');
    }

    const normalizedEmail = data.email.trim().toLowerCase();
    const stored = await readStoredUsers();

    if (stored.some((entry) => entry.user.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const user = profileForRole(data.role, {
      id: `${data.role}-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      phone: data.phone,
      gender: data.gender,
      memberSince: new Date().toISOString().slice(0, 10),
      totalTrips: 0,
      totalSpent: 0,
      points: 0,
      rating: 5.0,
      tier: data.role === 'rider' ? 'BRONZE' : undefined,
      co2Saved: data.role === 'rider' ? '0kg' : undefined,
      activePlans: data.role === 'rider' ? 0 : undefined,
      savedLocation: data.role === 'rider' ? 'Dhaka, Bangladesh' : undefined,
      emergencyContact: data.phone,
    });

    await writeStoredUsers([...stored, { user, password: data.password }]);
    return user;
  },

  async loginAsGuest(role: UserRole = 'rider'): Promise<User> {
    await delay(400);
    return profileForRole(role, {
      id: 'guest',
      name: role === 'driver' ? 'Guest Captain' : 'Guest Rider',
      email: 'guest@nittojatra.com',
      totalTrips: 0,
      totalSpent: 0,
      points: 0,
      tier: role === 'rider' ? 'BRONZE' : undefined,
      rating: 5.0,
    });
  },

  async updateUser(current: User, patch: Partial<User>): Promise<User> {
    await delay(300);
    const updated = { ...current, ...patch };

    const stored = await readStoredUsers();
    const index = stored.findIndex((entry) => entry.user.id === current.id);
    if (index >= 0) {
      const next = [...stored];
      next[index] = { ...next[index], user: updated };
      await writeStoredUsers(next);
    }

    return updated;
  },
};
