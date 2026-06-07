import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateSeats, SeatMap } from '@/components/booking/SeatMap';
import { Badge, serviceTypeToBadge } from '@/components/ui';
import { getOperatorById, MOCK_SEARCH_RESULTS } from '@/constants/mock-data';
import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';

const CONVENIENCE_FEE = 5;
const MAX_SEATS = 2;

const AMENITIES = [
  { icon: 'snow-outline', label: 'AC' },
  { icon: 'wifi-outline', label: 'WiFi' },
  { icon: 'battery-charging-outline', label: 'Charging' },
  { icon: 'film-outline', label: 'Movies' },
] as const;

export default function RideDetailScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const rideId = id ?? 'r1';

  const result = useMemo(
    () => MOCK_SEARCH_RESULTS.find((r) => r.id === rideId) ?? MOCK_SEARCH_RESULTS[0],
    [rideId],
  );
  const operator = getOperatorById(result.operatorId);
  const seats = useMemo(() => generateSeats(result.id), [result.id]);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    haptics.selection();
    setSelected((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId);
      if (prev.length >= MAX_SEATS) return [prev[prev.length - 1], seatId];
      return [...prev, seatId];
    });
  };

  const subtotal = selected.length * result.price;
  const total = selected.length > 0 ? subtotal + CONVENIENCE_FEE : 0;

  const handleConfirm = () => {
    if (selected.length === 0) return;
    router.push({
      pathname: '/ride/confirm',
      params: {
        rideId: result.id,
        seats: selected.join(','),
        total: String(total),
        subtotal: String(subtotal),
        fee: String(CONVENIENCE_FEE),
      },
    });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.navBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.navTitle}>Ride Details</Text>
          <View style={styles.iconBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={[styles.logo, { backgroundColor: operator?.color ?? colors.primary }]}>
              <Text style={styles.logoText}>{operator?.name.charAt(0) ?? 'N'}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.operatorName}>{operator?.name}</Text>
              <View style={styles.heroMeta}>
                <Badge label={result.type} variant={serviceTypeToBadge(result.type)} small />
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color={colors.warning} />
                  <Text style={styles.ratingText}>{result.rating.toFixed(1)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Journey card */}
          <View style={styles.card}>
            <View style={styles.journeyRow}>
              <View>
                <Text style={styles.time}>{result.departure}</Text>
                <Text style={styles.city}>{result.from}</Text>
              </View>
              <View style={styles.journeyMid}>
                <Text style={styles.duration}>{result.duration}</Text>
                <View style={styles.dashLine} />
                <Ionicons name="bus" size={16} color={colors.primary} />
              </View>
              <View style={styles.alignEnd}>
                <Text style={styles.time}>{result.arrival}</Text>
                <Text style={styles.city}>{result.to}</Text>
              </View>
            </View>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
              <Text style={styles.dateText}>Today, departs {result.departure}</Text>
            </View>
          </View>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesRow}>
            {AMENITIES.map((a) => (
              <View key={a.label} style={styles.amenity}>
                <View style={styles.amenityIcon}>
                  <Ionicons name={a.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.amenityLabel}>{a.label}</Text>
              </View>
            ))}
          </View>

          {/* Seat map */}
          <Text style={styles.sectionTitle}>Select Seats</Text>
          <Text style={styles.sectionHint}>Choose up to {MAX_SEATS} seats</Text>
          <View style={styles.card}>
            <SeatMap seats={seats} selected={selected} onToggle={toggleSeat} />
          </View>

          {/* Selected list */}
          {selected.length > 0 ? (
            <View style={styles.selectedRow}>
              <Text style={styles.selectedLabel}>Selected:</Text>
              {selected.map((s) => (
                <View key={s} style={styles.selectedChip}>
                  <Text style={styles.selectedChipText}>{s}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Price summary */}
          <View style={styles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {selected.length} seat{selected.length === 1 ? '' : 's'} × ৳{result.price}
              </Text>
              <Text style={styles.summaryValue}>৳ {subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Convenience fee</Text>
              <Text style={styles.summaryValue}>৳ {selected.length > 0 ? CONVENIENCE_FEE : 0}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>৳ {total}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Sticky bottom bar */}
      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <View style={styles.bottomContent}>
          <View>
            <Text style={styles.bottomLabel}>Total</Text>
            <Text style={styles.bottomTotal}>৳ {total}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Confirm booking"
            accessibilityState={{ disabled: selected.length === 0 }}
            disabled={selected.length === 0}
            onPress={handleConfirm}
            style={({ pressed }) => [
              styles.confirmBtn,
              selected.length === 0 && styles.confirmDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.confirmText}>CONFIRM BOOKING</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.md,
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.section,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.lg,
  },
  flex: {
    flex: 1,
  },
  operatorName: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.lg,
    color: colors.textPrimary,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journeyMid: {
    flex: 1,
    alignItems: 'center',
  },
  duration: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: colors.textMuted,
    marginBottom: 4,
  },
  dashLine: {
    width: '70%',
    height: 1.5,
    backgroundColor: colors.borderMid,
    marginBottom: Spacing.sm,
  },
  time: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.lg,
    color: colors.textPrimary,
  },
  city: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderMid,
  },
  dateText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.md,
    color: colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionHint: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: colors.textMuted,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  amenitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  amenity: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  amenityIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  selectedLabel: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  selectedChipText: {
    color: colors.white,
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.base,
    color: colors.textPrimary,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderMid,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.md,
    color: colors.textPrimary,
  },
  totalValue: {
    fontFamily: Typography.fonts.extrabold,
    fontSize: Typography.fontSizes.lg,
    color: colors.primary,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Shadows.float,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  bottomLabel: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: colors.textMuted,
  },
  bottomTotal: {
    fontFamily: Typography.fonts.extrabold,
    fontSize: Typography.fontSizes.xl,
    color: colors.textPrimary,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    borderRadius: Radius.md,
  },
  confirmDisabled: {
    backgroundColor: colors.textMuted,
  },
  pressed: {
    opacity: 0.9,
  },
  confirmText: {
    color: colors.white,
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    letterSpacing: 0.5,
  },
});
