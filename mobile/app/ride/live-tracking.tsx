import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MapHeader } from '@/components/shared/MapHeader';
import { StatusDot } from '@/components/ui';
import { Colors, Gradients, Radius, Spacing, Typography } from '@/constants/theme';
import { getOperatorById } from '@/constants/mock-data';

export default function LiveTrackingScreen() {
  const operator = getOperatorById('op1');

  return (
    <View style={styles.root}>
      <MapHeader height={280} useBasemap onBack={() => router.back()}>
        <View style={styles.livePill}>
          <StatusDot size={8} />
          <Text style={styles.liveText}>LIVE TRACKING</Text>
        </View>
        <View style={styles.mapCenter}>
          <Ionicons name="navigate" size={32} color={Colors.primary} />
        </View>
      </MapHeader>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
        <Text style={styles.etaValue}>5 mins</Text>
        <View style={styles.distanceRow}>
          <View style={styles.navChip}>
            <Ionicons name="navigate" size={14} color={Colors.primary} />
          </View>
          <Text style={styles.distance}>1.2 km away</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>

        <View style={styles.driverCard}>
          <LinearGradient colors={[...Gradients.avatar]} style={styles.avatar}>
            <Text style={styles.avatarText}>K</Text>
          </LinearGradient>
          <View style={styles.driverInfo}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ 4.9</Text>
            </View>
            <Text style={styles.driverName}>{operator?.name}</Text>
            <Text style={styles.carInfo}>{operator?.vehicle} • Dhaka</Text>
            <Text style={styles.plate}>{operator?.plate}</Text>
          </View>
          <View style={styles.driverActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Chat driver" style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Call driver" style={styles.actionBtn}>
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Share trip" style={styles.neutralBtn}>
            <Ionicons name="share-social-outline" size={18} color={Colors.textPrimary} />
            <Text style={styles.neutralText}>Share Trip</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Emergency" style={styles.emergencyBtn}>
            <Ionicons name="warning" size={18} color={Colors.white} />
            <Text style={styles.emergencyText}>Emergency</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  livePill: {
    position: 'absolute',
    top: Spacing.sm,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  liveText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald, letterSpacing: 1 },
  mapCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xxl },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card, padding: Spacing.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.base },
  etaLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  etaValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xxl, color: Colors.textPrimary },
  distanceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.sm },
  navChip: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  distance: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  progressTrack: { height: 4, backgroundColor: Colors.track, borderRadius: 2, marginBottom: Spacing.lg },
  progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  driverCard: { flexDirection: 'row', gap: Spacing.md, backgroundColor: Colors.surfaceMuted, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.base },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.white },
  driverInfo: { flex: 1 },
  ratingBadge: { alignSelf: 'flex-start', backgroundColor: Colors.gold, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full, marginBottom: 4 },
  ratingText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white },
  driverName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  carInfo: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  plate: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  driverActions: { gap: Spacing.sm },
  actionBtn: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  bottomActions: { flexDirection: 'row', gap: Spacing.md },
  neutralBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderMid },
  neutralText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  emergencyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.danger },
  emergencyText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.white },
});
