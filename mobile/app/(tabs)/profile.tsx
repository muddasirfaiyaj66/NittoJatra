import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

const ACCOUNT_ITEMS = [
  { icon: 'person-outline', title: 'Personal Details', sub: 'Name, Email, Emergency Contact', route: '/personal-details' },
  { icon: 'location-outline', title: 'Saved Places', sub: 'Home, Office, Frequent', route: '/modals/saved-places' },
  { icon: 'shield-checkmark-outline', title: 'Verification Info', sub: 'NID & Safety Verification', route: '/modals/verification-info' },
  { icon: 'lock-closed-outline', title: 'Account Security', sub: 'Password, 2FA, Security logs', route: '/account-security' },
  { icon: 'card-outline', title: 'Payment Methods', sub: 'Cards, bKash, Wallet', route: '/wallet' },
  { icon: 'gift-outline', title: 'Refer & Earn', sub: 'Invite friends, get rides', route: '/refer-earn' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBg}>
        <View style={styles.headerOrb1} />
        <View style={styles.headerOrb2} />
        <View style={styles.headerActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" style={styles.glassBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Logout"
            onPress={() => { logout(); router.replace('/(auth)/welcome'); }}
            style={[styles.glassBtn, styles.logoutBtn]}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          </Pressable>
        </View>
      </View>

      <View style={styles.profileCard}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} tint="light" style={styles.profileCardBlur}>
            <View style={styles.profileCardInner}>{renderProfileBody(user)}</View>
          </BlurView>
        ) : (
          <View style={[styles.profileCardInner, styles.profileCardAndroid]}>{renderProfileBody(user)}</View>
        )}

        <View style={styles.avatarFloat}>
          <View style={styles.avatarFrame}>
            <LinearGradient colors={[...Gradients.avatar]} style={styles.avatar}>
              <Text style={styles.avatarText}>{(user?.name ?? 'A')[0]}</Text>
            </LinearGradient>
          </View>
          <LinearGradient colors={['#FBBF24', '#F97316']} style={styles.tierPill}>
            <Ionicons name="ribbon" size={12} color={Colors.white} />
            <Text style={styles.tierText}>{user?.tier ?? 'Gold'}</Text>
          </LinearGradient>
        </View>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Go Premium">
        <LinearGradient colors={[...Gradients.premiumBanner]} style={styles.premiumCard}>
          <View style={styles.premiumIcon}>
            <Ionicons name="diamond" size={24} color="#FBBF24" />
          </View>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumSub}>Get 10% off every ride + priority</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.white} />
        </LinearGradient>
      </Pressable>

      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <View style={[styles.accountCard, Shadows.card]}>
        {ACCOUNT_ITEMS.map((item, i) => (
          <Pressable
            key={item.title}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            onPress={() => item.route && router.push(item.route as '/personal-details' | '/modals/saved-places' | '/modals/verification-info' | '/account-security' | '/wallet' | '/refer-earn')}
            style={[styles.listItem, i < ACCOUNT_ITEMS.length - 1 && styles.listItemBorder]}
          >
            <View style={styles.listIcon}>
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.textPrimary} />
            </View>
            <View style={styles.listText}>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.listSub}>{item.sub}</Text>
            </View>
            <View style={styles.chevronWrap}>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function renderProfileBody(user: User | null) {
  return (
    <>
      <Text style={styles.name}>{user?.name ?? 'Ahmed Rahman'}</Text>
      <Text style={styles.email}>{user?.email ?? 'rider@example.com'}</Text>
      <View style={styles.statsRow}>
        {[
          { label: 'Rating', value: user?.rating ?? 4.8, star: true },
          { label: 'Rides', value: user?.totalTrips ?? 42 },
          { label: 'Points', value: user?.points ?? 1250 },
        ].map((s) => (
          <View key={s.label} style={styles.statBox}>
            <View style={styles.statValueRow}>
              {s.star && <Ionicons name="star" size={14} color={Colors.gold} />}
              <Text style={[styles.statValue, s.star && styles.statValueGold]}>{s.value}</Text>
            </View>
            <Text style={styles.statLabel}>{s.label.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  headerBg: {
    backgroundColor: Colors.darkDeep,
    height: 160,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
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
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', zIndex: 1 },
  glassBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: { borderColor: 'rgba(244,63,94,0.2)' },
  profileCard: {
    marginHorizontal: Spacing.xl,
    marginTop: -64,
    borderRadius: Radius.xl,
    overflow: 'visible',
  },
  profileCardBlur: { borderRadius: Radius.xl, overflow: 'hidden' },
  profileCardInner: {
    paddingTop: 65,
    paddingHorizontal: 25,
    paddingBottom: 25,
    alignItems: 'center',
  },
  profileCardAndroid: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    ...Shadows.card,
  },
  avatarFloat: { position: 'absolute', top: -64, alignSelf: 'center', alignItems: 'center' },
  avatarFrame: {
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    padding: 4,
    ...Shadows.float,
  },
  avatar: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xxl, color: Colors.white },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.base,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 4,
    borderColor: Colors.white,
    marginTop: -12,
    ...Shadows.float,
  },
  tierText: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.heading,
    lineHeight: 32,
  },
  email: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.stat,
    marginBottom: Spacing.xl,
    lineHeight: 16,
  },
  statsRow: { flexDirection: 'row', gap: Spacing.md, width: '100%', justifyContent: 'center' },
  statBox: {
    flex: 1,
    maxWidth: 106,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 13,
    alignItems: 'center',
  },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, letterSpacing: Typography.letterSpacing.stat },
  statValueGold: { color: Colors.gold },
  statLabel: { fontFamily: Typography.fonts.bold, fontSize: 9, color: Colors.textMuted, letterSpacing: 0.9, textTransform: 'uppercase' },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.base,
    borderRadius: Radius.card,
    padding: Spacing.xl,
    gap: Spacing.base,
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
  premiumTitle: { fontFamily: Typography.fonts.black, fontSize: 18, color: Colors.textPrimary, letterSpacing: -0.45, lineHeight: 28 },
  premiumSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: '#E0F2FE', letterSpacing: Typography.letterSpacing.stat },
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
  accountCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: 0 },
  listItemBorder: { borderBottomWidth: 0 },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  listText: { flex: 1 },
  listTitle: { fontFamily: Typography.fonts.bold, fontSize: 15, color: Colors.textPrimary, letterSpacing: -0.375, lineHeight: 22.5 },
  listSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: Typography.letterSpacing.stat, lineHeight: 15 },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
