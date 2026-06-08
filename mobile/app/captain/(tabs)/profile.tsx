import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileGlassCard } from '@/components/profile/ProfileGlassCard';
import { ProfileHeaderActions } from '@/components/profile/ProfileHeaderActions';
import { ProfileMenuItem, ProfileMenuList } from '@/components/profile/ProfileMenuList';
import { ProfileStatsRow } from '@/components/profile/ProfileStatsRow';
import { profileStyles } from '@/components/profile/profileStyles';
import { ROUTES } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const DRIVER_AVATAR = require('../../../assets/figma/avatar-driver.png');

const PREFERENCE_ITEMS: ProfileMenuItem[] = [
  { icon: 'person-outline', title: 'Personal Information', subtitle: 'Update your professional identity', route: '/personal-details' },
  { icon: 'car-outline', title: 'Vehicle Management', subtitle: 'Edit vehicle stats and documents', route: '/captain/modals/vehicle-management' },
  { icon: 'map-outline', title: 'Saved Zones', subtitle: 'Manage your safety/service areas', route: '/saved-zones' },
  { icon: 'shield-checkmark-outline', title: 'Safety & Verification', subtitle: 'NID, License & Verification', route: '/modals/verification-info' },
  { icon: 'lock-closed-outline', title: 'Account Security', subtitle: 'Password, 2FA, Security logs', route: '/account-security' },
  { icon: 'settings-outline', title: 'App Settings', subtitle: 'Notifications & Global preferences', route: '/notifications' },
];

export default function DriverProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.welcome);
  };

  const handleMenuPress = (item: ProfileMenuItem) => {
    if (item.route) router.push(item.route as '/personal-details');
  };

  const displayName = user?.name ?? 'Karim Uddin';
  const vehicle = user?.vehicle ?? 'Toyota Axio 2018';

  return (
    <View style={profileStyles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={profileStyles.scroll} showsVerticalScrollIndicator={false}>
        <View
          style={[
            profileStyles.headerBg,
            profileStyles.driverHeader,
            { height: insets.top + 232, paddingTop: insets.top },
          ]}
        >
          <View style={profileStyles.driverOrbIndigo} />
          <View style={profileStyles.driverOrbPurple} />
          <ProfileHeaderActions onLogout={handleLogout} />
        </View>

        <View style={profileStyles.profileCardWrap}>
          <ProfileGlassCard>
            <ProfileAvatar overlay image={DRIVER_AVATAR} name={displayName} showShield />
            <Text style={profileStyles.name}>{displayName}</Text>
            <View style={profileStyles.metaRow}>
              <View style={profileStyles.captainPill}>
                <Text style={profileStyles.captainText}>Captain</Text>
              </View>
              <Text style={profileStyles.dot}>•</Text>
              <Text style={profileStyles.vehicle}>{vehicle}</Text>
            </View>
            <ProfileStatsRow
              stats={[
                { label: 'Rating', value: String(user?.rating ?? 4.9), gold: true, showStar: true },
                { label: 'Trips', value: String(user?.totalTrips ?? 1450) },
                { label: 'Exp', value: '2.5 Yrs' },
              ]}
            />
          </ProfileGlassCard>
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Level 5 Captain" style={profileStyles.bannerWrap}>
          <LinearGradient colors={['#4F46E5', '#9333EA']} style={profileStyles.levelBanner}>
            <View style={profileStyles.bannerOrb} />
            <View style={profileStyles.bannerIcon}>
              <Ionicons name="medal" size={24} color="#FBBF24" />
            </View>
            <View style={profileStyles.bannerText}>
              <Text style={profileStyles.levelTitle}>Level 5 Captain</Text>
              <Text style={profileStyles.levelSub}>You are in the top 5% of drivers!</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
          </LinearGradient>
        </Pressable>

        <Text style={profileStyles.sectionLabel}>Preferences</Text>
        <ProfileMenuList items={PREFERENCE_ITEMS} onPress={handleMenuPress} />
      </ScrollView>
    </View>
  );
}
