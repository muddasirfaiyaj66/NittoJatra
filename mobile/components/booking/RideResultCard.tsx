import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, serviceTypeToBadge } from '@/components/ui';
import { getOperatorById } from '@/constants/mock-data';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { SearchResult } from '@/types';

interface RideResultCardProps {
  result: SearchResult;
  onBook: (result: SearchResult) => void;
  onViewDetails: (result: SearchResult) => void;
}

export function RideResultCard({ result, onBook, onViewDetails }: RideResultCardProps) {
  const operator = getOperatorById(result.operatorId);
  const operatorName = operator?.name ?? 'Operator';
  const operatorColor = operator?.color ?? Colors.primary;
  const lowSeats = result.seatsAvailable <= 5;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.operatorRow}>
          <View style={[styles.logo, { backgroundColor: operatorColor }]}>
            <Text style={styles.logoText}>{operatorName.charAt(0)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.operatorName} numberOfLines={1}>
              {operatorName}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={Colors.warning} />
              <Text style={styles.ratingText}>{result.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <Badge label={result.type} variant={serviceTypeToBadge(result.type)} small />
      </View>

      <View style={styles.journeyRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{result.departure}</Text>
          <Text style={styles.city}>{result.from}</Text>
        </View>

        <View style={styles.durationBlock}>
          <Text style={styles.duration}>{result.duration}</Text>
          <View style={styles.line}>
            <View style={styles.dot} />
            <View style={styles.dash} />
            <Ionicons name="bus" size={14} color={Colors.textMuted} />
            <View style={styles.dash} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={[styles.timeBlock, styles.alignEnd]}>
          <Text style={styles.time}>{result.arrival}</Text>
          <Text style={styles.city}>{result.to}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <View style={styles.seatsRow}>
            <Ionicons
              name="people-outline"
              size={14}
              color={lowSeats ? Colors.danger : Colors.textSecondary}
            />
            <Text style={[styles.seatsText, lowSeats && styles.seatsLow]}>
              {result.seatsAvailable} seats left
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View details for ${operatorName}`}
            onPress={() => onViewDetails(result)}
          >
            <Text style={styles.detailsLink}>View Details</Text>
          </Pressable>
        </View>

        <View style={styles.priceBlock}>
          <Text style={styles.price}>৳ {result.price}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Book ${operatorName}`}
            onPress={() => onBook(result)}
            style={({ pressed }) => [styles.bookBtn, pressed && styles.pressed]}
          >
            <Text style={styles.bookText}>BOOK THIS</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    marginRight: Spacing.sm,
  },
  flex: {
    flex: 1,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.white,
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.md,
  },
  operatorName: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.base,
  },
  timeBlock: {
    width: 72,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  time: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
  },
  city: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  durationBlock: {
    flex: 1,
    alignItems: 'center',
  },
  duration: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  dash: {
    width: 18,
    height: 1.5,
    backgroundColor: Colors.borderMid,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderMid,
    marginVertical: Spacing.base,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seatsText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
  },
  seatsLow: {
    color: Colors.danger,
  },
  detailsLink: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    marginTop: Spacing.sm,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  price: {
    fontFamily: Typography.fonts.extrabold,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
  },
  bookBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  pressed: {
    opacity: 0.85,
  },
  bookText: {
    color: Colors.white,
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: 0.5,
  },
});
