import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MapHeader } from '@/components/shared/MapHeader';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { getOperatorById, MOCK_SEARCH_RESULTS } from '@/constants/mock-data';

export default function SearchResultsScreen() {
  const { from, to } = useLocalSearchParams<{ from?: string; to?: string }>();
  const results = MOCK_SEARCH_RESULTS;

  return (
    <View style={styles.root}>
      <MapHeader height={200} onBack={() => router.back()} />

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.title}>Available Rides</Text>
          <Text style={styles.subtitle}>{results.length} rides found for {from ?? 'Shahbag'} → {to ?? 'Motijheel'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {results.map((r) => {
            const op = getOperatorById(r.operatorId);
            return (
              <Pressable
                key={r.id}
                accessibilityRole="button"
                accessibilityLabel={`Ride with ${op?.name}, ${r.seatsAvailable} seats left`}
                onPress={() => router.push(`/ride/${r.id}`)}
                style={[styles.card, Shadows.card]}
              >
                <View style={styles.cardHeader}>
                  <LinearGradient colors={[...Gradients.avatar]} style={styles.avatar}>
                    <Text style={styles.avatarText}>{(op?.name ?? 'D')[0]}</Text>
                  </LinearGradient>
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.driverName}>{op?.name}</Text>
                      {r.womenOnly && (
                        <View style={styles.womenBadge}>
                          <Text style={styles.womenText}>WOMEN ONLY</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.carInfo}>{op?.vehicle} • ★ {r.rating}</Text>
                  </View>
                  <View style={styles.priceCol}>
                    <Text style={styles.price}>{formatTaka(r.price)}</Text>
                    <Text style={styles.perSeat}>PER SEAT</Text>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>TIME</Text>
                    <Text style={styles.statValue}>{r.departure}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>DURATION</Text>
                    <Text style={styles.statValue}>{r.duration}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>SEATS</Text>
                    <Text style={styles.statValue}>{r.seatsAvailable} Left</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  sheet: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card, marginTop: -24 },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  sheetHeader: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  subtitle: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  list: { padding: Spacing.xl, gap: Spacing.base, paddingBottom: 40 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.white },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  driverName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  womenBadge: { backgroundColor: Colors.accentLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  womenText: { fontFamily: Typography.fonts.bold, fontSize: 8, color: Colors.accent },
  carInfo: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  priceCol: { alignItems: 'flex-end' },
  price: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.primary },
  perSeat: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.md },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5 },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary, marginTop: 2 },
});
