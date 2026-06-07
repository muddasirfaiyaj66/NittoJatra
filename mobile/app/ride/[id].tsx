import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MapHeader } from '@/components/shared/MapHeader';
import { GradientButton } from '@/components/ui';
import { Colors, formatTaka, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { getRideDetail } from '@/constants/mock-data';
import { usePaymentStore } from '@/store/payment.store';

export default function RideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const rideId = id ?? 'r1';
  const detail = useMemo(() => getRideDetail(rideId), [rideId]);
  const [selectedPlan, setSelectedPlan] = useState(detail.subscriptionPlans.find((p) => p.selected)?.id ?? 'sp2');
  const { setTotal, setRideId, reset } = usePaymentStore();

  const selectedPlanData = detail.subscriptionPlans.find((p) => p.id === selectedPlan);
  const bookPrice = selectedPlanData?.price ?? detail.price;

  const handleBook = () => {
    reset();
    setRideId(rideId);
    setTotal(bookPrice);
    router.push('/modals/payment-method');
  };

  return (
    <View style={styles.root}>
      <MapHeader height={220} onBack={() => router.back()}>
        <View style={styles.mapActions}>
          <View style={{ flex: 1 }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Favorite" style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={22} color={Colors.white} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Share" style={styles.iconBtn}>
            <Ionicons name="share-outline" size={22} color={Colors.white} />
          </Pressable>
        </View>
        <View style={styles.badges}>
          <View style={styles.badgeIndigo}><Text style={styles.badgeText}>{detail.badge}</Text></View>
          <View style={styles.badgeDark}><Text style={styles.badgeTextDark}>{detail.slot}</Text></View>
          {detail.womenOnly && (
            <View style={styles.badgePink}><Text style={styles.badgeTextPink}>WOMEN ONLY</Text></View>
          )}
        </View>
      </MapHeader>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.detailCard, Shadows.card]}>
          <View style={styles.priceRow}>
            <Text style={styles.routeName}>{detail.routeName}</Text>
            <View>
              <Text style={styles.price}>{formatTaka(detail.price)}</Text>
              <Text style={styles.perTrip}>PER TRIP</Text>
            </View>
          </View>
          <Text style={styles.timeRow}>🕐 {detail.departure} – {detail.arrival} • {detail.duration}</Text>
          <View style={styles.chips}>
            <View style={styles.chip}><Text style={styles.chipText}>{detail.seatsAvailable} Left</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>{detail.distance}</Text></View>
            <View style={[styles.chip, styles.chipVerified]}><Ionicons name="checkmark-circle" size={14} color={Colors.accentEmerald} /><Text style={styles.chipVerifiedText}>Verified</Text></View>
          </View>

          <Text style={styles.sectionTitle}>Route Timeline</Text>
          {detail.stops.map((stop, i) => (
            <View key={stop.name} style={styles.stopRow}>
              <View style={styles.timeline}>
                <View style={[styles.stopDot, i === detail.stops.length - 1 && styles.stopDotEnd]} />
                {i < detail.stops.length - 1 && <View style={styles.stopLine} />}
              </View>
              <View style={styles.stopInfo}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopLabel}>{stop.label} — {stop.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.facilitiesCard, Shadows.card]}>
          <Text style={styles.sectionTitle}>Ride Facilities</Text>
          <View style={styles.facilityRow}>
            {detail.facilities.map((f) => (
              <View key={f} style={styles.facilityChip}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.accentEmerald} />
                <Text style={styles.facilityText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Chat driver" style={styles.darkBtn}>
            <Ionicons name="chatbubble-outline" size={18} color={Colors.white} />
            <Text style={styles.darkBtnText}>Chat</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Call driver" style={styles.darkBtn}>
            <Ionicons name="call-outline" size={18} color={Colors.white} />
            <Text style={styles.darkBtnText}>Call</Text>
          </Pressable>
        </View>

        {detail.reviews.length > 0 && (
          <View style={[styles.reviewsCard, Shadows.card]}>
            <Text style={styles.sectionTitle}>Rider Review</Text>
            {detail.reviews.map((r) => (
              <View key={r.id} style={styles.reviewRow}>
                <View style={styles.reviewAvatar}><Text style={styles.reviewInitial}>{r.initial}</Text></View>
                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                    <Text style={styles.reviewTime}>{r.timeAgo}</Text>
                  </View>
                  <Text style={styles.reviewStars}>{'★'.repeat(r.rating)}</Text>
                  <Text style={styles.reviewQuote}>&ldquo;{r.quote}&rdquo;</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Subscription Plans</Text>
        <View style={styles.plansRow}>
          {detail.subscriptionPlans.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityLabel={`${p.name} plan ${formatTaka(p.price)}`}
              onPress={() => setSelectedPlan(p.id)}
              style={[styles.planCard, selectedPlan === p.id && styles.planSelected]}
            >
              <Text style={styles.planName}>{p.name}</Text>
              <Text style={styles.planPrice}>{formatTaka(p.price)}</Text>
              <Text style={styles.planDiscount}>(−{p.discount}%)</Text>
            </Pressable>
          ))}
        </View>

        <GradientButton title="BOOK THIS RIDE" onPress={handleBook} style={styles.bookBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  mapActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  badges: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md, flexWrap: 'wrap' },
  badgeIndigo: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  badgeDark: { backgroundColor: Colors.darkBgNavy, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  badgePink: { backgroundColor: Colors.accentLight, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white },
  badgeTextDark: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white },
  badgeTextPink: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accent },
  scroll: { padding: Spacing.xl, paddingBottom: 40, gap: Spacing.base },
  detailCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.xl, marginTop: -Spacing.xxl },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  routeName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary, flex: 1 },
  price: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.primary },
  perTrip: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, textAlign: 'right' },
  timeRow: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginVertical: Spacing.md },
  chips: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: { backgroundColor: Colors.surfaceMuted, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full },
  chipText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textSecondary },
  chipVerified: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5' },
  chipVerifiedText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald },
  sectionTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, marginTop: Spacing.md, marginBottom: Spacing.sm },
  stopRow: { flexDirection: 'row', gap: Spacing.md },
  timeline: { alignItems: 'center', width: 16 },
  stopDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  stopDotEnd: { backgroundColor: Colors.primaryAlt },
  stopLine: { flex: 1, width: 2, backgroundColor: Colors.borderMid, minHeight: 24 },
  stopInfo: { flex: 1, paddingBottom: Spacing.md },
  stopName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  stopLabel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  facilitiesCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base },
  facilityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  facilityChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surfaceMuted, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  facilityText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  actionRow: { flexDirection: 'row', gap: Spacing.md },
  darkBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.darkBgNavy, paddingVertical: Spacing.md, borderRadius: Radius.lg },
  darkBtnText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.white },
  reviewsCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base },
  reviewRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  reviewInitial: { fontFamily: Typography.fonts.black, color: Colors.primary },
  reviewContent: { flex: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewAuthor: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  reviewTime: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  reviewStars: { color: Colors.gold, fontSize: 12, marginVertical: 2 },
  reviewQuote: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, fontStyle: 'italic' },
  plansRow: { flexDirection: 'row', gap: Spacing.sm },
  planCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 2, borderColor: Colors.border, alignItems: 'center' },
  planSelected: { borderColor: Colors.primary },
  planName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  planPrice: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.primary, marginVertical: 4 },
  planDiscount: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald },
  bookBtn: { marginTop: Spacing.md },
});
