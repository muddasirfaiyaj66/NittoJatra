import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const ACCOUNT_ITEMS = [
  { icon: 'person-outline', title: 'Personal Details', sub: 'Name, email, phone' },
  { icon: 'location-outline', title: 'Saved Places', sub: 'Home, office & more', route: '/modals/saved-places' },
  { icon: 'shield-checkmark-outline', title: 'Verification Info', sub: 'NID verified', route: '/modals/verification-info' },
  { icon: 'lock-closed-outline', title: 'Account Security', sub: 'Password & PIN' },
  { icon: 'gift-outline', title: 'Refer & Earn', sub: 'Invite friends' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      <LinearGradient colors={[...Gradients.navyHeader]} style={styles.header}>
        <View style={styles.headerActions}>
          <View />
          <Pressable accessibilityRole="button" accessibilityLabel="Logout" onPress={() => { logout(); router.replace('/(auth)/welcome'); }}>
            <Ionicons name="log-out-outline" size={22} color={Colors.danger} />
          </Pressable>
        </View>
        <View style={styles.avatarFrame}>
          <LinearGradient colors={[...Gradients.avatar]} style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name ?? 'A')[0]}</Text>
          </LinearGradient>
          <View style={styles.tierPill}>
            <Text style={styles.tierText}>{user?.tier ?? 'GOLD'}</Text>
          </View>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Ahmed Rahman'}</Text>
        <Text style={styles.email}>{user?.email ?? 'rider@example.com'}</Text>
        <View style={styles.statsRow}>
          {[
            { label: 'RATING', value: `★${user?.rating ?? 4.8}` },
            { label: 'RIDES', value: String(user?.totalTrips ?? 42) },
            { label: 'POINTS', value: String(user?.points ?? 1250) },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <Pressable accessibilityRole="button" accessibilityLabel="Go Premium">
        <LinearGradient colors={[Colors.primary, Colors.primaryAlt]} style={styles.premiumCard}>
          <Ionicons name="diamond" size={24} color={Colors.white} />
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumSub}>Get 10% off every ride + priority</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.white} />
        </LinearGradient>
      </Pressable>

      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      {ACCOUNT_ITEMS.map((item) => (
        <Pressable
          key={item.title}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          onPress={() => item.route && router.push(item.route as '/modals/saved-places')}
          style={[styles.listItem, Shadows.card]}
        >
          <View style={styles.listIcon}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.primary} />
          </View>
          <View style={styles.listText}>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listSub}>{item.sub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </Pressable>
      ))}

      <Pressable accessibilityRole="button" accessibilityLabel="Wallet" onPress={() => router.push('/wallet')} style={[styles.listItem, Shadows.card]}>
        <View style={styles.listIcon}>
          <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
        </View>
        <View style={styles.listText}>
          <Text style={styles.listTitle}>Wallet</Text>
          <Text style={styles.listSub}>Balance & payment methods</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: { paddingTop: 60, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl, alignItems: 'center' },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: Spacing.lg },
  avatarFrame: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.white },
  avatarText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.white },
  tierPill: { position: 'absolute', bottom: -8, alignSelf: 'center', backgroundColor: Colors.gold, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  tierText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xs, color: Colors.white },
  name: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.white, marginTop: Spacing.lg },
  email: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textMuted, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  statItem: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.lg, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, alignItems: 'center' },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.white },
  statLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  premiumCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.xl, marginTop: -Spacing.xl, borderRadius: Radius.card, padding: Spacing.base, gap: Spacing.md },
  premiumText: { flex: 1 },
  premiumTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.white },
  premiumSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: 'rgba(255,255,255,0.8)' },
  sectionLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1, marginHorizontal: Spacing.xl, marginTop: Spacing.xl, marginBottom: Spacing.md },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginHorizontal: Spacing.xl, marginBottom: Spacing.sm, gap: Spacing.md },
  listIcon: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  listText: { flex: 1 },
  listTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  listSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
});
