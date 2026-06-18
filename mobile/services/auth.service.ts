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

function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const trimmed = phone.trim();
  if (!trimmed) return undefined;
  if (/^\+8801[3-9]\d{8}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^01[3-9]\d{8}$/.test(trimmed)) {
    return `+88${trimmed}`;
  }
  return trimmed;
}

function normalizePassword(password: string): string {
  return password;
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

    const dbRole = payload.user.role;
    const expectedDbRole = effectiveRole === 'driver' ? 'operator' : 'user';
    if (dbRole !== expectedDbRole) {
      const dbRoleLabel = dbRole === 'operator' ? 'Driver' : 'Rider';
      throw new Error(
        `Role mismatch: This account is registered as a ${dbRoleLabel}. Please use the ${dbRoleLabel} tab to log in.`
      );
    }

    const user = await persistAuth(payload, effectiveRole);
    return user;
  },

  async register(data: RegisterData): Promise<User> {
    if (!data.email?.trim() || !data.password) {
      throw new Error('Email and password are required.');
    }

    const payload = await apiClient.post<ApiAuthPayload>('/auth/register', {
      ...(data.name?.trim() ? { fullName: data.name.trim() } : {}),
      email: data.email.trim().toLowerCase(),
      ...(data.phone ? { phone: normalizePhone(data.phone) } : {}),
      password: normalizePassword(data.password),
      ...(data.gender ? { gender: data.gender } : {}),
      role: data.role === 'driver' ? 'operator' : 'user',
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
    const payload: Parameters<typeof userService.updateProfile>[0] = {};
    if (patch.name !== undefined) payload.fullName = patch.name;
    if (patch.phone !== undefined) payload.phone = patch.phone;
    if (patch.gender !== undefined) payload.gender = patch.gender;
    if (patch.vehicle !== undefined) payload.vehicleModel = patch.vehicle;
    if (patch.vehiclePlate !== undefined) payload.vehiclePlate = patch.vehiclePlate;
    if (patch.vehicleType !== undefined) payload.vehicleType = patch.vehicleType;
    if (patch.emergencyContact !== undefined) payload.emergencyContact = patch.emergencyContact;
    if (patch.emergencyContactEmail !== undefined) payload.emergencyContactEmail = patch.emergencyContactEmail;

    const updated = await userService.updateProfile(payload, current.role);
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
