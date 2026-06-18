import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { ROUTES } from '@/constants/routes';
import { useDriverStore } from '@/store/driver.store';

export default function ScheduleHubScreen() {
  const [tab, setTab] = useState(0);
  const schedules = useDriverStore((s) => s.schedules);
  const isLoading = useDriverStore((s) => s.isLoading);
  const filtered = schedules.filter((s) => (tab === 0 ? s.status === 'active' : s.status === 'archived'));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Text style={styles.title}>Schedule Hub</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Add schedule" onPress={() => router.push(ROUTES.driverPostRoute)} style={styles.iconBtn}>
            <Ionicons name="add" size={24} color={Colors.primary} />
          </Pressable>
        </View>
      </SafeAreaView>
      <View style={styles.segmentWrap}>
        <SegmentedControl options={['ACTIVE PLANS', 'ARCHIVED']} selected={tab} onChange={setTab} />
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {isLoading && filtered.length === 0 ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>No schedules for this tab today.</Text>
        ) : (
          filtered.map((s) => (
            <View key={s.id} style={[styles.card, Shadows.card]}>
              <View style={styles.badge}><Text style={styles.badgeText}>SCHEDULE</Text></View>
              <Text style={styles.time}>{s.time}</Text>
              <Text style={styles.name}>{s.name}</Text>
              <View style={styles.timeline}>
                <View style={styles.dotStart} />
                <View style={styles.line} />
                <View style={styles.dotEnd} />
              </View>
              <Text style={styles.point}>START POINT: {s.origin}</Text>
              <Text style={styles.point}>END POINT: {s.destination}</Text>
              <View style={styles.footer}>
                <View style={styles.avatarStack}>
                  {s.riders.map((r, i) => (
                    <View key={i} style={[styles.miniAvatar, { marginLeft: i > 0 ? -8 : 0 }]}><Text style={styles.miniText}>{r}</Text></View>
                  ))}
                  <Text style={styles.plusN}>+{Math.max(0, s.totalSeats - s.seatsFilled)}</Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Manage schedule" onPress={() => router.push('/driver/modals/management-console')} style={styles.manageBtn}>
                  <Text style={styles.manageText}>MANAGE</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  segmentWrap: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.base },
  list: { padding: Spacing.xl, gap: Spacing.base, paddingBottom: 100 },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base },
  badge: { alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full, marginBottom: Spacing.sm },
  badgeText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald },
  time: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  name: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary, marginBottom: Spacing.md },
  timeline: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  dotStart: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  line: { flex: 1, height: 2, backgroundColor: Colors.borderMid },
  dotEnd: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.textMuted },
  point: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.base },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  miniText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary },
  plusN: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, marginLeft: Spacing.xs },
  manageBtn: { backgroundColor: Colors.darkBgNavy, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.lg },
  manageText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white, letterSpacing: 1 },
});
