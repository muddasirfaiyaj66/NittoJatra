import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const PREFS = [
  { icon: 'person-outline', title: 'Personal Information', route: null },
  { icon: 'car-outline', title: 'Vehicle Management', route: '/(driver)/modals/vehicle-management' },
  { icon: 'map-outline', title: 'Saved Zones', route: '/saved-zones' },
  { icon: 'shield-checkmark-outline', title: 'Safety & Verification', route: null },
  { icon: 'settings-outline', title: 'App Settings', route: null },
];

export default function DriverProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      <LinearGradient colors={[...Gradients.navyHeader]} style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Logout" onPress={() => { logout(); router.replace('/(auth)/welcome'); }} style={styles.logout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.danger} />
        </Pressable>
        <View style={styles.avatarWrap}>
          <LinearGradient colors={[...Gradients.avatar]} style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name ?? 'K')[0]}</Text>
          </LinearGradient>
          <View style={styles.shield}><Ionicons name="shield-checkmark" size={14} color={Colors.accentEmerald} /></View>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Karim Uddin'}</Text>
        <Text style={styles.sub}>CAPTAIN • Toyota Axio 2018</Text>
        <View style={styles.statsRow}>
          {[
            { label: 'RATING', value: `★${user?.rating ?? 4.9}` },
            { label: 'TRIPS', value: String(user?.totalTrips ?? 1450) },
            { label: 'EXP', value: '2.5 Yrs' },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <LinearGradient colors={[Colors.primary, Colors.primaryAlt]} style={styles.levelCard}>
        <Ionicons name="medal" size={28} color={Colors.white} />
        <View style={styles.levelText}>
          <Text style={styles.levelTitle}>Level 5 Captain</Text>
          <Text style={styles.levelSub}>You are in the top 5% of drivers!</Text>
        </View>
      </LinearGradient>

      <Text style={styles.sectionLabel}>PREFERENCES</Text>
      {PREFS.map((p) => (
        <Pressable
          key={p.title}
          accessibilityRole="button"
          accessibilityLabel={p.title}
          onPress={() => p.route && router.push(p.route as '/(driver)/modals/vehicle-management' | '/saved-zones')}
          style={[styles.listItem, Shadows.card]}
        >
          <Ionicons name={p.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.primary} />
          <Text style={styles.listTitle}>{p.title}</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: { paddingTop: 60, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl, alignItems: 'center' },
  logout: { alignSelf: 'flex-end' },
  avatarWrap: { position: 'relative', marginVertical: Spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.white },
  shield: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.white, borderRadius: 12, padding: 2 },
  name: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.white },
  sub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textMuted, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  stat: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.lg, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, alignItems: 'center' },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.white },
  statLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  levelCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.xl, marginTop: -Spacing.xl, borderRadius: Radius.card, padding: Spacing.base, gap: Spacing.md },
  levelText: { flex: 1 },
  levelTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.white },
  levelSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: 'rgba(255,255,255,0.8)' },
  sectionLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1, marginHorizontal: Spacing.xl, marginTop: Spacing.xl, marginBottom: Spacing.md },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginHorizontal: Spacing.xl, marginBottom: Spacing.sm, gap: Spacing.md },
  listTitle: { flex: 1, fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
});
