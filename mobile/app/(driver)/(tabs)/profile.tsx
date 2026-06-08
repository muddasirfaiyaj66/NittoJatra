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
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const DRIVER_AVATAR = require('../../../assets/figma/avatar-driver.png');

const PREFERENCE_ITEMS: ProfileMenuItem[] = [
  {
    icon: 'person-outline',
    title: 'Personal Information',
    subtitle: 'Update your professional identity',
    route: '/personal-details',
  },
  {
    icon: 'car-outline',
    title: 'Vehicle Management',
    subtitle: 'Edit vehicle stats and documents',
    route: '/(driver)/modals/vehicle-management',
  },
  {
    icon: 'map-outline',
    title: 'Saved Zones',
    subtitle: 'Manage your safety/service areas',
    route: '/saved-zones',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Safety & Verification',
    subtitle: 'NID, License & Verification',
    route: '/modals/verification-info',
  },
  {
    icon: 'lock-closed-outline',
    title: 'Account Security',
    subtitle: 'Password, 2FA, Security logs',
    route: '/account-security',
  },
  {
    icon: 'settings-outline',
    title: 'App Settings',
    subtitle: 'Notifications & Global preferences',
    route: '/notifications',
  },
];

export default function DriverProfileScreen() {
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

  const displayName = user?.name ?? 'Karim Uddin';
  const vehicle = user?.vehicle ?? 'Toyota Axio 2018';

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.headerBg}>
          <View style={styles.headerOrbIndigo} />
          <View style={styles.headerOrbPurple} />
          <ProfileHeaderActions onBack={() => router.back()} onLogout={handleLogout} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCardWrap}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} tint="light" style={styles.profileCardBlur}>
              <View style={styles.profileCardInner}>{renderDriverBody(displayName, vehicle, user)}</View>
            </BlurView>
          ) : (
            <View style={[styles.profileCardInner, styles.profileCardAndroid]}>
              {renderDriverBody(displayName, vehicle, user)}
            </View>
          )}
          <ProfileAvatar image={DRIVER_AVATAR} name={displayName} showShield />
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Level 5 Captain" style={styles.levelWrap}>
          <LinearGradient colors={[Colors.primary, Colors.primaryAlt]} style={styles.levelCard}>
            <View style={styles.levelOrb} />
            <View style={styles.levelIcon}>
              <Ionicons name="medal" size={24} color="#FBBF24" />
            </View>
            <View style={styles.levelText}>
              <Text style={styles.levelTitle}>Level 5 Captain</Text>
              <Text style={styles.levelSub}>You are in the top 5% of drivers!</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
          </LinearGradient>
        </Pressable>

        <Text style={styles.sectionLabel}>Preferences</Text>
        <ProfileMenuList items={PREFERENCE_ITEMS} onPress={handleMenuPress} />
      </ScrollView>
    </View>
  );
}

function renderDriverBody(
  name: string,
  vehicle: string,
  user: ReturnType<typeof useAuth>['user'],
) {
  return (
    <>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.metaRow}>
        <View style={styles.captainPill}>
          <Text style={styles.captainText}>Captain</Text>
        </View>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.vehicle}>{vehicle}</Text>
      </View>
      <ProfileStatsRow
        stats={[
          { label: 'Rating', value: String(user?.rating ?? 4.9), gold: true, showStar: true },
          { label: 'Trips', value: String(user?.totalTrips ?? 1450) },
          { label: 'Exp', value: '2.5 Yrs' },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safeTop: { backgroundColor: Colors.darkDeep },
  scroll: { paddingBottom: 120 },
  headerBg: {
    backgroundColor: Colors.darkDeep,
    height: 104,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    ...Shadows.glass,
  },
  headerOrbIndigo: {
    position: 'absolute',
    top: -128,
    right: -128,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: Colors.orbIndigo,
  },
  headerOrbPurple: {
    position: 'absolute',
    bottom: -128,
    left: -128,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: Colors.orbPurple,
  },
  profileCardWrap: {
    marginHorizontal: Spacing.xl,
    marginTop: -48,
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
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  captainPill: {
    backgroundColor: Colors.surfaceIndigo,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  captainText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    lineHeight: 16,
  },
  dot: {
    fontFamily: Typography.fonts.regular,
    fontSize: 15,
    color: '#CBD5E1',
    lineHeight: 22.5,
  },
  vehicle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 16,
  },
  levelWrap: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.base,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.card,
    padding: Spacing.xl,
    gap: Spacing.base,
    minHeight: 96,
    overflow: 'hidden',
    shadowColor: '#C7D2FE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 6,
  },
  levelOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  levelIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: { flex: 1 },
  levelTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: -0.45,
    lineHeight: 28,
  },
  levelSub: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: '#E0E7FF',
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
