import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { locationService } from '@/services/location.service';
import { buildZoneSummaries, routeService, SavedZoneSummary } from '@/services/route.service';

export default function SavedZonesScreen() {
  const [zones, setZones] = useState<SavedZoneSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [locations, routes] = await Promise.all([
          locationService.getAll(),
          routeService.getAll(),
        ]);
        setZones(
          buildZoneSummaries(
            locations.map((location) => ({
              _id: location.id,
              nameEn: location.nameEn,
              zone: location.zone,
            })),
            routes,
          ),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Saved Zones</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Add zone" style={styles.back}>
            <Ionicons name="add" size={22} color={Colors.primary} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>DRIVER ZONES</Text>
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        ) : zones.length === 0 ? (
          <Text style={styles.emptyText}>No zones loaded from the server.</Text>
        ) : (
          zones.map((z) => (
            <View key={z.id} style={[styles.zoneCard, Shadows.card]}>
              <View style={styles.zoneIcon}>
                <Ionicons name="map" size={20} color={Colors.primary} />
              </View>
              <View style={styles.zoneText}>
                <Text style={styles.zoneName}>{z.name}</Text>
                <Text style={styles.zoneMeta}>{z.radius} radius • {z.rides} routes</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
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
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  scroll: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 40 },
  sectionLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  zoneCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md },
  zoneIcon: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  zoneText: { flex: 1 },
  zoneName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  zoneMeta: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
});
