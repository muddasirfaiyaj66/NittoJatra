import { BlurView } from 'expo-blur';
import { type ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { profileStyles } from '@/components/profile/profileStyles';

const useGlassCard = Platform.OS === 'ios';

interface ProfileGlassCardProps {
  children: ReactNode;
}

export function ProfileGlassCard({ children }: ProfileGlassCardProps) {
  if (useGlassCard) {
    return (
      <BlurView intensity={20} tint="light" style={profileStyles.profileCardBlur}>
        <View style={profileStyles.profileCardInner}>{children}</View>
      </BlurView>
    );
  }
  return <View style={[profileStyles.profileCardInner, profileStyles.profileCardAndroid]}>{children}</View>;
}
