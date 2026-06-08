import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileHeaderActions } from '@/components/profile/ProfileHeaderActions';
import { ProfileMenuItem, ProfileMenuList } from '@/components/profile/ProfileMenuList';
import { ProfileStatsRow } from '@/components/profile/ProfileStatsRow';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const RIDER_AVATAR = require('../../assets/figma/avatar-rider.png');

const ACCOUNT_ITEMS: ProfileMenuItem[] = [
  { icon: 'person-outline', title: 'Personal Details', subtitle: 'Name, Email, Emergency Contact', route: '/personal-details' },
  { icon: 'location-outline', title: 'Saved Places', subtitle: 'Home, Office, Frequent', route: '/modals/saved-places' },
  { icon: 'shield-checkmark-outline', title: 'Verification Info', subtitle: 'NID & Safety Verification', route: '/modals/verification-info' },
  { icon: 'lock-closed-outline', title: 'Account Security', subtitle: 'Password, 2FA, Security logs', route: '/account-security' },
  { icon: 'card-outline', title: 'Payment Methods', subtitle: 'Cards, bKash, Wallet', route: '/wallet' },
  { icon: 'gift-outline', title: 'Refer & Earn', subtitle: 'Invite friends, get rides', route: '/refer-earn' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  const handleMenuPress = (item: ProfileMenuItem) => {
    if (item.route) {
      router.push(item.route as '/personal-details');
    }
  };

  const displayName = user?.name ?? 'Ahmed Rahman';
  const displayEmail = user?.email ?? 'rider@example.com';

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.headerBg}>
          <View style={styles.headerOrb1} />
          <View style={styles.headerOrb2} />
          <ProfileHeaderActions onBack={() => router.back()} onLogout={handleLogout} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCardWrap}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} tint="light" style={styles.profileCardBlur}>
              <View style={styles.profileCardInner}>{renderProfileBody(displayName, displayEmail, user)}</View>
            </BlurView>
          ) : (
            <View style={[styles.profileCardInner, styles.profileCardAndroid]}>
              {renderProfileBody(displayName, displayEmail, user)}
            </View>
          )}
          <ProfileAvatar
            image={RIDER_AVATAR}
            name={displayName}
            tierLabel={(user?.tier ?? 'GOLD').charAt(0) + (user?.tier ?? 'GOLD').slice(1).toLowerCase()}
          />
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Go Premium" style={styles.premiumWrap}>
          <LinearGradient colors={[...Gradients.premiumBanner]} style={styles.premiumCard}>
            <View style={styles.premiumOrb} />
            <View style={styles.premiumIcon}>
              <Ionicons name="diamond" size={24} color="#FBBF24" />
            </View>
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Go Premium</Text>
              <Text style={styles.premiumSub}>Get 10% off every ride + priority</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
          </LinearGradient>
        </Pressable>

        <Text style={styles.sectionLabel}>Account</Text>
        <ProfileMenuList items={ACCOUNT_ITEMS} onPress={handleMenuPress} />
      </ScrollView>
    </View>
  );
}

function renderProfileBody(name: string, email: string, user: ReturnType<typeof useAuth>['user']) {
  return (
    <>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <ProfileStatsRow
        stats={[
          { label: 'Rating', value: String(user?.rating ?? 4.8), gold: true, showStar: true },
          { label: 'Rides', value: String(user?.totalTrips ?? 42) },
          { label: 'Points', value: String(user?.points ?? 1250) },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safeTop: { backgroundColor: Colors.darkDeep },
  scroll: { paddingBottom: 120, paddingTop: 0 },
  headerBg: {
    backgroundColor: Colors.darkDeep,
    height: 128,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    ...Shadows.glass,
  },
  headerOrb1: {
    position: 'absolute',
    top: -128,
    left: -128,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(2,132,199,0.2)',
  },
  headerOrb2: {
    position: 'absolute',
    bottom: -128,
    right: -128,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(192,38,211,0.1)',
  },
  profileCardWrap: {
    marginHorizontal: Spacing.xl,
    marginTop: -64,
    borderRadius: Radius.xl,
    overflow: 'visible',
  },
  profileCardBlur: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 8,
  },
  profileCardInner: {
    paddingTop: 65,
    paddingHorizontal: 25,
    paddingBottom: 25,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  profileCardAndroid: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    ...Shadows.card,
  },
  name: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.heading,
    lineHeight: 32,
    marginBottom: 4,
  },
  email: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.stat,
    marginBottom: Spacing.xl,
    lineHeight: 16,
  },
  premiumWrap: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.base,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.card,
    padding: Spacing.xl,
    gap: Spacing.base,
    overflow: 'hidden',
    shadowColor: '#BAE6FD',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 6,
  },
  premiumOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumText: { flex: 1 },
  premiumTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: -0.45,
    lineHeight: 28,
  },
  premiumSub: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: '#E0F2FE',
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 16,
  },
  sectionLabel: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.subtitle,
    textTransform: 'uppercase',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    paddingLeft: Spacing.sm,
  },
});
