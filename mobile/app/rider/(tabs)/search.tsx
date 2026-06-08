import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SolidButton } from '@/components/ui';
import { MapHeader } from '@/components/shared/MapHeader';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { RECENT_PLACES } from '@/constants/mock-data';

export default function FindScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const search = () => {
    router.push({ pathname: '/ride/results', params: { from: from || 'Shahbag', to: to || 'Motijheel' } });
  };

  return (
    <View style={styles.root}>
      <MapHeader height={490} useBasemap onBack={() => router.back()} />

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Where do you want to go?</Text>

        <View style={styles.routeStack}>
          <LinearGradient
            colors={[...Gradients.routeDivider]}
            style={styles.routeDivider}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <View style={[styles.routeCard, styles.routeCardFrom]}>
            <View style={styles.fromDot} />
            <View style={styles.routeInput}>
              <Text style={styles.routeLabel}>FROM</Text>
              <TextInput
                accessibilityLabel="From location"
                placeholder="Enter pickup"
                placeholderTextColor={Colors.textMuted}
                value={from}
                onChangeText={setFrom}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.routeCard}>
            <View style={styles.toDot} />
            <View style={styles.routeInput}>
              <Text style={styles.routeLabel}>TO</Text>
              <TextInput
                accessibilityLabel="To location"
                placeholder="Enter destination"
                placeholderTextColor={Colors.textMuted}
                value={to}
                onChangeText={setTo}
                style={styles.input}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>RECENT PLACES</Text>
        <ScrollView style={styles.recentList} showsVerticalScrollIndicator={false}>
          {RECENT_PLACES.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityLabel={`${p.name}, ${p.label}`}
              onPress={() => setTo(p.name)}
              style={styles.recentRow}
            >
              <View style={styles.recentIcon}>
                <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
              </View>
              <View style={styles.recentText}>
                <Text style={styles.recentName}>{p.name}</Text>
                <Text style={styles.recentLabel}>{p.label}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <SolidButton title="SEARCH AVAILABLE RIDE" onPress={search} style={styles.searchBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.track },
  sheet: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -48,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
    ...Shadows.sheet,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: Colors.track,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.lg,
    letterSpacing: Typography.letterSpacing.h2,
    color: Colors.textPrimary,
    lineHeight: 28,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  routeStack: {
    position: 'relative',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },
  routeDivider: {
    position: 'absolute',
    left: 27,
    top: 40,
    bottom: 40,
    width: 2,
    opacity: 0.2,
    borderRadius: 1,
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: 16.8,
    paddingVertical: 16.2,
  },
  routeCardFrom: {
    marginBottom: -14,
    zIndex: 1,
  },
  fromDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primaryGradStart,
    backgroundColor: Colors.white,
  },
  toDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.purple500,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  routeInput: { flex: 1 },
  routeLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    lineHeight: 10,
    textTransform: 'uppercase',
  },
  input: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    paddingVertical: 4,
    letterSpacing: Typography.letterSpacing.stat,
  },
  sectionLabel: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  recentList: { flex: 1 },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentText: { flex: 1 },
  recentName: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 20,
  },
  recentLabel: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 15,
  },
  searchBtn: { marginTop: Spacing.base },
});
