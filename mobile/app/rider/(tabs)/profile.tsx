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
import { Colors, Gradients } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const RIDER_AVATAR = require('../../../assets/figma/avatar-rider.png');

const ACCOUNT_ITEMS: ProfileMenuItem[] = [
  { icon: 'person-outline', title: 'Personal Details', subtitle: 'Name, Email, Emergency Contact', route: '/personal-details' },
  { icon: 'location-outline', title: 'Saved Places', subtitle: 'Home, Office, Frequent', route: '/modals/saved-places' },
  { icon: 'shield-checkmark-outline', title: 'Verification Info', subtitle: 'NID & Safety Verification', route: '/modals/verification-info' },
  { icon: 'lock-closed-outline', title: 'Account Security', subtitle: 'Password, 2FA, Security logs', route: '/account-security' },
  { icon: 'card-outline', title: 'Payment Methods', subtitle: 'Cards, bKash, Wallet', route: '/wallet' },
  { icon: 'gift-outline', title: 'Refer & Earn', subtitle: 'Invite friends, get rides', route: '/refer-earn' },
];

function formatTier(tier?: string) {
  if (!tier) return 'Gold';
  return tier.charAt(0) + tier.slice(1).toLowerCase();
}

export default function RiderProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.welcome);
  };

  const handleMenuPress = (item: ProfileMenuItem) => {
    if (item.route) router.push(item.route as '/personal-details');
  };

  const displayName = user?.name ?? 'Ahmed Rahman';
  const displayEmail = user?.email ?? 'rider@example.com';

  return (
    <View style={profileStyles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={profileStyles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.headerBg, profileStyles.riderHeader, { paddingTop: insets.top }]}>
          <View style={profileStyles.riderOrbCyan} />
          <View style={profileStyles.riderOrbPink} />
          <ProfileHeaderActions onLogout={handleLogout} />
        </View>

        <View style={profileStyles.profileCardWrap}>
          <ProfileGlassCard>
            <ProfileAvatar overlay image={RIDER_AVATAR} name={displayName} tierLabel={formatTier(user?.tier)} />
            <Text style={profileStyles.name}>{displayName}</Text>
            <Text style={profileStyles.email}>{displayEmail}</Text>
            <ProfileStatsRow
              stats={[
                { label: 'Rating', value: String(user?.rating ?? 4.8), gold: true, showStar: true },
                { label: 'Rides', value: String(user?.totalTrips ?? 42) },
                { label: 'Points', value: String(user?.points ?? 1250) },
              ]}
            />
          </ProfileGlassCard>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go Premium"
          onPress={() => router.push('/ride/subscription-tracker')}
          style={profileStyles.bannerWrap}
        >
          <LinearGradient colors={[...Gradients.premiumBanner]} style={profileStyles.premiumBanner}>
            <View style={profileStyles.bannerOrb} />
            <View style={profileStyles.bannerIcon}>
              <Ionicons name="diamond" size={24} color="#FBBF24" />
            </View>
            <View style={profileStyles.bannerText}>
              <Text style={profileStyles.premiumTitle}>Go Premium</Text>
              <Text style={profileStyles.premiumSub}>Get 10% off every ride + priority</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
          </LinearGradient>
        </Pressable>

        <Text style={profileStyles.sectionLabel}>Account</Text>
        <ProfileMenuList items={ACCOUNT_ITEMS} onPress={handleMenuPress} />
      </ScrollView>
    </View>
  );
}
