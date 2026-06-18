import { apiClient } from '@/services/api.client';
import { ApiUser } from '@/services/api.types';
import { mapApiUser } from '@/services/mappers';
import { User, UserRole } from '@/types';

export const userService = {
  async getProfile(clientRole: UserRole = 'rider'): Promise<User> {
    const profile = await apiClient.get<ApiUser>('/users/me', undefined, true);
    return mapApiUser(profile, clientRole);
  },

  async updateProfile(
    patch: {
      fullName?: string;
      phone?: string;
      gender?: string;
      vehicleModel?: string;
      vehiclePlate?: string;
      vehicleType?: string;
      emergencyContact?: string;
      emergencyContactEmail?: string;
    },
    clientRole: UserRole = 'rider',
  ): Promise<User> {
    const profile = await apiClient.patch<ApiUser>('/users/me', patch, true);
    return mapApiUser(profile, clientRole);
  },

  async changePassword(input: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<void> {
    await apiClient.patch('/users/me/password', input, true);
  },

  async deactivateAccount(): Promise<void> {
    await apiClient.delete('/users/me', true);
  },
};
