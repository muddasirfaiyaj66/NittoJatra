import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { MOCK_ACTIVE_PLAN } from '@/constants/mock-data';

const CALENDAR_DAYS = [
  { day: 1, status: 'taken' }, { day: 2, status: 'taken' }, { day: 3, status: 'missed' },
  { day: 4, status: 'taken' }, { day: 5, status: 'taken' }, { day: 6, status: 'absent' }, { day: 7, status: 'taken' },
  { day: 8, status: 'taken' }, { day: 9, status: 'taken' }, { day: 10, status: 'taken' },
];

export default function SubscriptionTrackerScreen() {
  const [rideStarted, setRideStarted] = useState(false);

  const handleHereStart = () => {
    Alert.alert('Ride Started', 'Your ride has been confirmed. Have a safe journey!');
    setRideStarted(true);
  };

  const handleMissed = () =>
    Alert.alert('Marked as Missed', 'This ride has been marked as missed.');

  const handleAbsent = () =>
    Alert.alert('Marked as Absent', 'You have been marked absent for this ride.');
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <View>
            <Text style={styles.title}>Subscription Tracker</Text>
            <Text style={styles.subtitle}>{MOCK_ACTIVE_PLAN.route}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[...Gradients.navyHeader]} style={styles.statusCard}>
          <Ionicons name="location" size={24} color={Colors.white} />
          <Text style={styles.waitingText}>Karim is waiting at your pickup point</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="I'm here start"
            onPress={handleHereStart}
            style={[styles.hereBtn, rideStarted && { backgroundColor: Colors.accentEmerald }]}
          >
            <Text style={[styles.hereBtnText, rideStarted && { color: Colors.white }]}>
              {rideStarted ? '✓ Ride Started' : "I'm Here (Start)"}
            </Text>
          </Pressable>
          <View style={styles.absentRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Missed" onPress={handleMissed} style={styles.absentBtn}>
              <Text style={styles.absentText}>MISSED</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Absent" onPress={handleAbsent} style={styles.absentBtn}>
              <Text style={styles.absentText}>ABSENT</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={[styles.card, Shadows.card]}>
          <Text style={styles.cardTitle}>Current Progress</Text>
          <Text style={styles.passName}>Monthly Pass</Text>
          <Text style={styles.progressBig}>{MOCK_ACTIVE_PLAN.progress.current}/{MOCK_ACTIVE_PLAN.progress.total}</Text>
          <Text style={styles.progressSub}>RIDES TAKEN</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(MOCK_ACTIVE_PLAN.progress.current / MOCK_ACTIVE_PLAN.progress.total) * 100}%` }]} />
          </View>
          <Text style={styles.dateRange}>STARTED: JAN 1, 2026 — ENDS: JAN 31, 2026</Text>
        </View>

        <View style={[styles.card, Shadows.card]}>
          <Text style={styles.cardTitle}>Ride Calendar</Text>
          <View style={styles.legend}>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.accentEmerald }]} /><Text style={styles.legendText}>Taken</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.danger }]} /><Text style={styles.legendText}>Missed</Text></View>
          </View>
          <View style={styles.calendarGrid}>
            {CALENDAR_DAYS.map((d) => (
              <View key={d.day} style={[styles.calDay, d.status === 'taken' && styles.calTaken, d.status === 'missed' && styles.calMissed, d.status === 'absent' && styles.calAbsent]}>
                <Text style={styles.calDayText}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Report issue"
            onPress={() => router.push('/modals/report-issue')}
            style={[styles.actionCard, { backgroundColor: '#FEF2F2' }]}
          >
            <Ionicons name="flag" size={20} color={Colors.danger} />
            <Text style={[styles.actionText, { color: Colors.danger }]}>Report Issue</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rate driver"
            onPress={() => router.push('/modals/rate-driver')}
            style={[styles.actionCard, { backgroundColor: Colors.surfaceIndigo }]}
          >
            <Ionicons name="star" size={20} color={Colors.primary} />
            <Text style={[styles.actionText, { color: Colors.primary }]}>Rate Driver</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  subtitle: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  scroll: { padding: Spacing.xl, gap: Spacing.base, paddingBottom: 40 },
  statusCard: { borderRadius: Radius.card, padding: Spacing.xl, alignItems: 'center', gap: Spacing.md },
  waitingText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.white, textAlign: 'center' },
  hereBtn: { backgroundColor: Colors.white, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, borderRadius: Radius.lg },
  hereBtnText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  absentRow: { flexDirection: 'row', gap: Spacing.md },
  absentBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.lg, backgroundColor: 'rgba(0,0,0,0.3)' },
  absentText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white, letterSpacing: 1 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.xl },
  cardTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, marginBottom: Spacing.md },
  passName: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  progressBig: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xxl, color: Colors.primary },
  progressSub: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  progressTrack: { height: 6, backgroundColor: Colors.track, borderRadius: 3, marginVertical: Spacing.md },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  dateRange: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  legend: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  calDay: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceMuted },
  calTaken: { backgroundColor: '#ECFDF5' },
  calMissed: { backgroundColor: '#FEF2F2' },
  calAbsent: { backgroundColor: Colors.surfaceMuted2 },
  calDayText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  actionRow: { flexDirection: 'row', gap: Spacing.md },
  actionCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.base, borderRadius: Radius.lg },
  actionText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm },
});
