import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, formatTaka, Radius, Spacing, Typography } from '@/constants/theme';
import { useDriverStore } from '@/store/driver.store';

export default function ManagementConsoleModal() {
  const schedule = useDriverStore((s) => s.schedules[0]);
  const riders = useDriverStore((s) => s.riders);

  if (!schedule) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.handle} />
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
          <View style={styles.content}>
            <Text style={styles.routeTitle}>No active schedule</Text>
            <Text style={styles.meta}>Today&apos;s rides will appear here from the API.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </Pressable>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.routeTitle}>{schedule.name}</Text>
          <Text style={styles.meta}>DEPARTURE: {schedule.time} • SUBSCRIBERS {schedule.seatsFilled}/{schedule.totalSeats}</Text>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CONNECTED RIDERS</Text>
            <Text style={styles.booked}>{riders.length} Booked</Text>
          </View>
          {riders.length === 0 ? (
            <Text style={styles.emptyText}>No passengers booked on today&apos;s rides yet.</Text>
          ) : (
            riders.map((r) => (
              <View key={r.id} style={styles.riderRow}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{r.initial}</Text></View>
                <View style={styles.riderInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.riderName}>{r.name}</Text>
                    {r.verified && <Text style={styles.verified}>VERIFIED</Text>}
                  </View>
                  <Text style={styles.plan}>{r.plan} • {formatTaka(r.amount)}</Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={`Call ${r.name}`}><Ionicons name="call-outline" size={18} color={Colors.primary} /></Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Chat ${r.name}`}><Ionicons name="chatbubble-outline" size={18} color={Colors.primary} /></Pressable>
              </View>
            ))
          )}
          <GradientButton title="INITIATE JOURNEY" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  close: { alignSelf: 'flex-end', paddingHorizontal: Spacing.xl },
  content: { padding: Spacing.xl, gap: Spacing.md },
  routeTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  meta: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  sectionTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  booked: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.primary },
  riderInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  riderName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  verified: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald },
  plan: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
});
