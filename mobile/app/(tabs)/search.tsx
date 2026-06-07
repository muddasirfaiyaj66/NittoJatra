import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RideResultCard } from '@/components/booking/RideResultCard';
import { DEFAULT_FILTERS, FilterSheet, SearchFilters } from '@/components/search/FilterSheet';
import { EmptyState } from '@/components/shared/EmptyState';
import { RideCardSkeleton } from '@/components/shared/Skeleton';
import { Button } from '@/components/ui';
import { MOCK_SEARCH_RESULTS } from '@/constants/mock-data';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { SearchResult } from '@/types';

type SortKey = 'price' | 'departure' | 'duration';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'price', label: 'Price' },
  { key: 'departure', label: 'Departure' },
  { key: 'duration', label: 'Duration' },
];

const parseMinutes = (duration: string) => parseInt(duration.replace(/\D/g, ''), 10) || 0;
const departureHour = (time: string) => parseInt(time.split(':')[0], 10) || 0;

function matchesFilters(result: SearchResult, filters: SearchFilters): boolean {
  if (filters.ac === 'ac' && result.type !== 'AC') return false;
  if (filters.ac === 'nonac' && result.type !== 'Non-AC') return false;
  if (filters.gender === 'women' && result.type !== 'Women Special') return false;
  if (filters.departure !== 'any') {
    const hour = departureHour(result.departure);
    const ranges: Record<string, [number, number]> = {
      morning: [5, 12],
      afternoon: [12, 17],
      evening: [17, 21],
      night: [21, 29],
    };
    const [start, end] = ranges[filters.departure];
    const normalized = hour < 5 ? hour + 24 : hour;
    if (normalized < start || normalized >= end) return false;
  }
  return true;
}

export default function SearchScreen() {
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>('departure');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  const results = useMemo(() => {
    const filtered = MOCK_SEARCH_RESULTS.filter((r) => matchesFilters(r, filters));
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return parseMinutes(a.duration) - parseMinutes(b.duration);
        case 'departure':
        default:
          return departureHour(a.departure) - departureHour(b.departure);
      }
    });
    return sorted;
  }, [filters, sort]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.ac !== 'all') count++;
    if (filters.gender !== 'all') count++;
    if (filters.departure !== 'any') count++;
    if (filters.seatClass !== 'economy') count++;
    return count;
  }, [filters]);

  const handleBook = (result: SearchResult) => router.push(`/ride/${result.id}`);
  const handleDetails = (result: SearchResult) => router.push(`/ride/${result.id}`);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>Mirpur</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} />
          <Text style={styles.routeTitle}>Motijheel</Text>
        </View>
        <Text style={styles.resultCount}>
          {loading ? 'Searching…' : `${results.length} rides found`}
        </Text>
      </View>

      {/* Sort + filter bar */}
      <View style={styles.filterBar}>
        <View style={styles.sortRow}>
          {SORTS.map((s) => {
            const active = sort === s.key;
            return (
              <Pressable
                key={s.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Sort by ${s.label}`}
                onPress={() => setSort(s.key)}
                style={[styles.sortItem, active && styles.sortItemActive]}
              >
                <Text style={[styles.sortText, active && styles.sortTextActive]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open filters"
          onPress={() => setFilterVisible(true)}
          style={styles.filterBtn}
        >
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
          {activeFilterCount > 0 ? (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{activeFilterCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.listContent}>
          {[0, 1, 2, 3].map((i) => (
            <RideCardSkeleton key={i} />
          ))}
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No rides found"
          message="Try adjusting your filters to see more results."
          action={
            <Button
              title="Reset Filters"
              variant="outline"
              onPress={() => setFilters(DEFAULT_FILTERS)}
            />
          }
        />
      ) : (
        <FlashList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RideResultCard result={item} onBook={handleBook} onViewDetails={handleDetails} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterSheet
        visible={filterVisible}
        initial={filters}
        onClose={() => setFilterVisible(false)}
        onApply={(f) => {
          setFilters(f);
          setFilterVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  routeTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
  },
  resultCount: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderMid,
  },
  sortRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.border,
    borderRadius: Radius.md,
    padding: 4,
  },
  sortItem: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  sortItemActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sortText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
  },
  sortTextActive: {
    color: Colors.primary,
    fontFamily: Typography.fonts.semibold,
  },
  filterBtn: {
    width: 48,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderMid,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  filterCount: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterCountText: {
    color: Colors.white,
    fontFamily: Typography.fonts.bold,
    fontSize: 10,
  },
  listContent: {
    padding: Spacing.lg,
  },
});
