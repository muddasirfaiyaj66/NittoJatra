import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

const ISSUE_CATEGORIES = [
  { id: 'late', icon: 'time-outline' as const, label: 'Driver was late' },
  { id: 'route', icon: 'map-outline' as const, label: 'Wrong route taken' },
  { id: 'behaviour', icon: 'person-outline' as const, label: 'Rude behaviour' },
  { id: 'vehicle', icon: 'car-outline' as const, label: 'Unsafe vehicle' },
  { id: 'no_show', icon: 'close-circle-outline' as const, label: 'Driver no-show' },
  { id: 'overcharge', icon: 'cash-outline' as const, label: 'Overcharging' },
  { id: 'other', icon: 'ellipsis-horizontal-outline' as const, label: 'Other' },
];

type Severity = 'low' | 'medium' | 'high';

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  low:    { label: 'Low',    color: Colors.accentEmerald, bg: '#ECFDF5' },
  medium: { label: 'Medium', color: Colors.gold,          bg: '#FFFBEB' },
  high:   { label: 'High',   color: Colors.danger,        bg: '#FEF2F2' },
};

export default function ReportIssueModal() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [severity, setSeverity] = useState<Severity>('medium');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!selectedCategory) {
      Alert.alert('Select a category', 'Please choose what type of issue you experienced.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Add details', 'Please describe the issue briefly before submitting.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => router.back(), 2000);
  };

  if (submitted) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.thankYou}>
          <View style={styles.successIcon}>
            <Ionicons name="shield-checkmark" size={72} color={Colors.accentEmerald} />
          </View>
          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successSub}>
            We&apos;ve received your report and will investigate within 24 hours. Thank you for helping keep NittoJatra safe.
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn} accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Report an Issue</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Ride info */}
        <View style={[styles.rideCard, Shadows.card]}>
          <View style={styles.rideIconWrap}>
            <Ionicons name="car" size={22} color={Colors.danger} />
          </View>
          <View style={styles.rideInfo}>
            <Text style={styles.rideName}>Karim Ahmed · Today</Text>
            <Text style={styles.rideSub}>Shahbag → Motijheel</Text>
          </View>
          <View style={styles.rideBadge}>
            <Text style={styles.rideBadgeText}>COMPLETED</Text>
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What happened?</Text>
          <View style={styles.categoryGrid}>
            {ISSUE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  accessibilityRole="button"
                  accessibilityLabel={cat.label}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[styles.categoryCard, active && styles.categoryCardActive]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={24}
                    color={active ? Colors.danger : Colors.textMuted2}
                  />
                  <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Severity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Severity</Text>
          <View style={styles.severityRow}>
            {(Object.keys(SEVERITY_CONFIG) as Severity[]).map((s) => {
              const cfg = SEVERITY_CONFIG[s];
              const active = severity === s;
              return (
                <Pressable
                  key={s}
                  accessibilityRole="button"
                  accessibilityLabel={`${cfg.label} severity`}
                  onPress={() => setSeverity(s)}
                  style={[
                    styles.severityBtn,
                    active && { backgroundColor: cfg.bg, borderColor: cfg.color },
                  ]}
                >
                  <View style={[styles.severityDot, { backgroundColor: cfg.color }]} />
                  <Text style={[styles.severityText, active && { color: cfg.color, fontFamily: Typography.fonts.bold }]}>
                    {cfg.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe the issue</Text>
          <TextInput
            accessibilityLabel="Issue description"
            style={styles.descInput}
            placeholder="Please provide as much detail as possible…"
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length} / 500</Text>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
          <Text style={styles.noteText}>
            False reports may result in account restrictions. Our team reviews all submissions.
          </Text>
        </View>

        {/* Submit */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Submit report"
          onPress={submit}
          style={styles.submitBtn}
        >
          <Ionicons name="flag" size={18} color={Colors.white} />
          <Text style={styles.submitText}>Submit Report</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
  },

  scroll: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 40 },

  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.xl,
  },
  rideIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FEF2F2',
    alignItems: 'center', justifyContent: 'center',
  },
  rideInfo: { flex: 1 },
  rideName: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
  },
  rideSub: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rideBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  rideBadgeText: {
    fontFamily: Typography.fonts.bold,
    fontSize: 9,
    color: Colors.accentEmerald,
    letterSpacing: 0.8,
  },

  section: { gap: Spacing.md },
  sectionTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.base,
  },
  categoryCardActive: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  categoryLabel: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  categoryLabelActive: {
    color: Colors.danger,
    fontFamily: Typography.fonts.bold,
  },

  severityRow: { flexDirection: 'row', gap: Spacing.sm },
  severityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderMid,
    backgroundColor: Colors.surface,
  },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  severityText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
  },

  descInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderMid,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    minHeight: 120,
  },
  charCount: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'right',
  },

  noteBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceIndigo,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.danger,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    marginTop: Spacing.sm,
  },
  submitText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.white,
    letterSpacing: 0.3,
  },

  thankYou: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl },
  successIcon: { marginBottom: Spacing.md },
  successTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
  },
  successSub: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
