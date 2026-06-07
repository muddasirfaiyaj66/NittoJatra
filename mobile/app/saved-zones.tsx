import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

const ZONES = [
  { id: 'z1', name: 'Shahbag Office Zone', radius: '500m', rides: 12 },
  { id: 'z2', name: 'Motijheel Pickup Zone', radius: '300m', rides: 8 },
  { id: 'z3', name: 'Dhanmondi Home Zone', radius: '400m', rides: 5 },
];

export default function SavedZonesScreen() {
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
        <Text style={styles.sectionLabel}>CAPTAIN ZONES</Text>
        {ZONES.map((z) => (
          <View key={z.id} style={[styles.zoneCard, Shadows.card]}>
            <View style={styles.zoneIcon}>
              <Ionicons name="map" size={20} color={Colors.primary} />
            </View>
            <View style={styles.zoneText}>
              <Text style={styles.zoneName}>{z.name}</Text>
              <Text style={styles.zoneMeta}>{z.radius} radius • {z.rides} rides</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary, letterSpacing: Typography.letterSpacing.heading },
  scroll: { padding: Spacing.xl, paddingBottom: 40 },
  sectionLabel: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.textMuted, letterSpacing: Typography.letterSpacing.subtitle, textTransform: 'uppercase', marginBottom: Spacing.md },
  zoneCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm, gap: Spacing.base, borderWidth: 1, borderColor: Colors.border },
  zoneIcon: { width: 48, height: 48, borderRadius: Radius.lg, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  zoneText: { flex: 1 },
  zoneName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  zoneMeta: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textMuted },
});
