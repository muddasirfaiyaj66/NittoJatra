import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { MapHeader } from '@/components/shared/MapHeader';
import { StatusDot } from '@/components/ui';
import { Colors, Gradients, Radius, Spacing, Typography } from '@/constants/theme';
import { chatRoute } from '@/constants/routes';
import { bookingService } from '@/services/booking.service';
import { messageService } from '@/services/message.service';
import { Booking } from '@/types';

export default function LiveTrackingScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(Boolean(bookingId));
  const [openingChat, setOpeningChat] = useState(false);

  const openChat = async () => {
    if (!bookingId || openingChat) return;
    setOpeningChat(true);
    try {
      const thread = await messageService.ensureFromBooking(bookingId);
      router.push(chatRoute(thread.id, thread.name));
    } finally {
      setOpeningChat(false);
    }
  };

  useEffect(() => {
    if (!bookingId) return;
    let active = true;
    void (async () => {
      try {
        const result = await bookingService.getMyBookings();
        const match = result.find((item) => item.id === bookingId) ?? null;
        if (active) setBooking(match);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [bookingId]);

  const operatorName = booking?.operator ?? 'NittoJatra';
  const driverName = booking?.driver ?? `${operatorName} Driver`;
  const routeLabel = booking ? `${booking.route.from} → ${booking.route.to}` : 'Live route tracking';

  return (
    <View style={styles.root}>
      <MapHeader height={280} onBack={() => router.back()}>
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
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginVertical: Spacing.xl }} />
        ) : (
          <>
            <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
            <Text style={styles.etaValue}>{booking?.arrivalTime ?? 'On schedule'}</Text>
            <View style={styles.distanceRow}>
              <View style={styles.navChip}>
                <Ionicons name="navigate" size={14} color={Colors.primary} />
              </View>
              <Text style={styles.distance}>{routeLabel}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>

            <View style={styles.driverCard}>
              <LinearGradient colors={[...Gradients.avatar]} style={styles.avatar}>
                <Text style={styles.avatarText}>{driverName.charAt(0)}</Text>
              </LinearGradient>
              <View style={styles.driverInfo}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ 4.9</Text>
                </View>
                <Text style={styles.driverName}>{driverName}</Text>
                <Text style={styles.carInfo}>{operatorName} • Dhaka</Text>
                <Text style={styles.plate}>Departs {booking?.departureTime ?? 'soon'}</Text>
              </View>
              <View style={styles.driverActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Chat driver"
                  onPress={() => void openChat()}
                  style={styles.actionBtn}
                >
                  {openingChat ? (
                    <ActivityIndicator color={Colors.primary} size="small" />
                  ) : (
                    <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
                  )}
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Call driver" style={styles.actionBtn}>
                  <Ionicons name="call-outline" size={18} color={Colors.primary} />
                </Pressable>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    margin: Spacing.xl,
  },
  liveText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white, letterSpacing: 1 },
  mapCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sheet: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    marginTop: -24,
    padding: Spacing.xl,
  },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.lg },
  etaLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  etaValue: { fontFamily: Typography.fonts.black, fontSize: 36, color: Colors.textPrimary, marginTop: 4 },
  distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: Spacing.md },
  navChip: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  distance: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  progressTrack: { height: 6, backgroundColor: Colors.border, borderRadius: Radius.full, marginTop: Spacing.lg, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: Radius.full },
  driverCard: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl, padding: Spacing.base, backgroundColor: Colors.background, borderRadius: Radius.lg },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.white },
  driverInfo: { flex: 1, gap: 2 },
  ratingBadge: { alignSelf: 'flex-start', backgroundColor: Colors.surfaceIndigo, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  ratingText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary },
  driverName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  carInfo: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  plate: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  driverActions: { gap: Spacing.sm },
  actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
});
