import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GradientButton } from '@/components/ui';
import { MapHeader } from '@/components/shared/MapHeader';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { RECENT_PLACES } from '@/constants/mock-data';

export default function FindScreen() {
  const [from, setFrom] = useState('Shahbag, Dhaka');
  const [to, setTo] = useState('');

  const search = () => {
    router.push({ pathname: '/ride/results', params: { from, to: to || 'Motijheel' } });
  };

  return (
    <View style={styles.root}>
      <MapHeader height={280} onBack={() => router.back()} />

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Where do you want to go?</Text>

        <View style={styles.routeGroup}>
          <View style={styles.routeRow}>
            <View style={styles.hollowDot} />
            <View style={styles.routeInput}>
              <Text style={styles.routeLabel}>FROM</Text>
              <TextInput accessibilityLabel="From location" value={from} onChangeText={setFrom} style={styles.input} />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.routeRow}>
            <View style={styles.filledDot} />
            <View style={styles.routeInput}>
              <Text style={styles.routeLabel}>TO</Text>
              <TextInput accessibilityLabel="To location" placeholder="Enter destination" placeholderTextColor={Colors.textMuted} value={to} onChangeText={setTo} style={styles.input} />
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>RECENT PLACES</Text>
        <ScrollView style={styles.recentList}>
          {RECENT_PLACES.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityLabel={`${p.name}, ${p.label}`}
              onPress={() => setTo(p.name)}
              style={styles.recentRow}
            >
              <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
              <View style={styles.recentText}>
                <Text style={styles.recentName}>{p.name}</Text>
                <Text style={styles.recentLabel}>{p.label}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <GradientButton title="SEARCH AVAILABLE RIDE" onPress={search} style={styles.searchBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  sheet: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    marginTop: -32,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.base },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary, marginBottom: Spacing.lg },
  routeGroup: { backgroundColor: Colors.surfaceMuted, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.lg },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  hollowDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.primary },
  filledDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primaryAlt },
  routeInput: { flex: 1 },
  routeLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  input: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: Colors.borderMid, marginVertical: Spacing.md, marginLeft: 28 },
  sectionLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1, marginBottom: Spacing.md },
  recentList: { flex: 1 },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  recentText: { flex: 1 },
  recentName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  recentLabel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  searchBtn: { marginTop: Spacing.base },
});
