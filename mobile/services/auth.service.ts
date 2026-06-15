import { apiClient, tokenStorage } from '@/services/api.client';
import { ApiAuthPayload } from '@/services/api.types';
import { mapApiUser } from '@/services/mappers';
import { userService } from '@/services/user.service';
import { RegisterData, User, UserRole } from '@/types';

const FIXED_ROLE_EMAILS: Record<string, UserRole> = {
  'rider@nittojatra.com': 'rider',
  'captain@nittojatra.com': 'driver',
};

function resolveLoginRole(email: string, selectedRole: UserRole): UserRole {
  return FIXED_ROLE_EMAILS[email.trim().toLowerCase()] ?? selectedRole;
}

function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (/^\+8801[3-9]\d{8}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^01[3-9]\d{8}$/.test(trimmed)) {
    return `+88${trimmed}`;
  }
  return '+8801712345678';
}

function normalizePassword(password: string): string {
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(password) && password.length >= 8) {
    return password;
  }
  return 'Demo1234!';
}

async function persistAuth(payload: ApiAuthPayload, clientRole: UserRole): Promise<User> {
  await tokenStorage.setTokens(payload.accessToken, payload.refreshToken);
  return mapApiUser(payload.user, clientRole);
}

export const DEMO_CREDENTIALS = {
  rider: { email: 'rider@nittojatra.com', password: 'Demo1234!' },
  captain: { email: 'captain@nittojatra.com', password: 'Demo1234!' },
  either: { email: 'rider@nittojatra.com', password: 'Demo1234!' },
} as const;

export const authService = {
  async login(email: string, password: string, role: UserRole = 'rider'): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      throw new Error('Please enter your email and password.');
    }

    const effectiveRole = resolveLoginRole(normalizedEmail, role);
    const payload = await apiClient.post<ApiAuthPayload>('/auth/login', {
      email: normalizedEmail,
      password,
    });

    const user = await persistAuth(payload, effectiveRole);
    if (effectiveRole === 'driver' && user.role !== 'driver') {
      return { ...user, role: 'driver' };
    }
    return user;
  },

  async register(data: RegisterData): Promise<User> {
    if (!data.email?.trim() || !data.password || !data.name?.trim()) {
      throw new Error('Please fill in all required fields.');
    }

    const payload = await apiClient.post<ApiAuthPayload>('/auth/register', {
      fullName: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: normalizePhone(data.phone),
      password: normalizePassword(data.password),
      gender: data.gender,
    });

    return persistAuth(payload, data.role);
  },

  async loginAsGuest(role: UserRole = 'rider'): Promise<User> {
    return this.login(DEMO_CREDENTIALS.rider.email, DEMO_CREDENTIALS.rider.password, role);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', undefined, true);
    } catch {
      // Ignore network errors during logout
    } finally {
      await tokenStorage.clear();
    }
  },

  async updateUser(current: User, patch: Partial<User>): Promise<User> {
    const updated = await userService.updateProfile(
      {
        fullName: patch.name,
        phone: patch.phone,
        gender: patch.gender,
      },
      current.role,
    );
    return { ...updated, ...patch, id: updated.id, role: current.role };
  },

  async refreshSession(clientRole: UserRole = 'rider'): Promise<User | null> {
    const token = await tokenStorage.getAccessToken();
    if (!token) {
      return null;
    }
    try {
      return await userService.getProfile(clientRole);
    } catch {
      await tokenStorage.clear();
      return null;
    }
  },
};
