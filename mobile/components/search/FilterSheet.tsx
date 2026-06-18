import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';

export interface SearchFilters {
  ac: 'all' | 'ac' | 'nonac';
  seatClass: 'economy' | 'business' | 'sleeper';
  departure: 'any' | 'morning' | 'afternoon' | 'evening' | 'night';
  gender: 'all' | 'women';
}

export const DEFAULT_FILTERS: SearchFilters = {
  ac: 'all',
  seatClass: 'economy',
  departure: 'any',
  gender: 'all',
};

interface FilterSheetProps {
  visible: boolean;
  initial: SearchFilters;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
}

interface OptionGroupProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

function OptionGroup<T extends string>({ label, value, options, onChange }: OptionGroupProps<T>) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${label} ${opt.label}`}
              onPress={() => onChange(opt.value)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function FilterSheet({ visible, initial, onClose, onApply }: FilterSheetProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [filters, setFilters] = useState<SearchFilters>(initial);

  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters" />
      <View style={styles.sheet}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset filters"
              onPress={() => setFilters(DEFAULT_FILTERS)}
            >
              <Text style={styles.reset}>Reset</Text>
            </Pressable>
          </View>

          <OptionGroup
            label="Coach Type"
            value={filters.ac}
            onChange={(v) => update('ac', v)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'ac', label: 'AC' },
              { value: 'nonac', label: 'Non-AC' },
            ]}
          />
          <OptionGroup
            label="Seat Class"
            value={filters.seatClass}
            onChange={(v) => update('seatClass', v)}
            options={[
              { value: 'economy', label: 'Economy' },
              { value: 'business', label: 'Business' },
              { value: 'sleeper', label: 'Sleeper' },
            ]}
          />
          <OptionGroup
            label="Departure Time"
            value={filters.departure}
            onChange={(v) => update('departure', v)}
            options={[
              { value: 'any', label: 'Any' },
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'evening', label: 'Evening' },
              { value: 'night', label: 'Night' },
            ]}
          />
          <OptionGroup
            label="Gender"
            value={filters.gender}
            onChange={(v) => update('gender', v)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'women', label: 'Women Only' },
            ]}
          />

          <Button
            title="Apply Filters"
            size="lg"
            style={styles.apply}
            onPress={() => onApply(filters)}
            icon={<Ionicons name="options-outline" size={18} color={colors.white} />}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(15,23,42,0.5)',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
    },
    handle: {
      alignSelf: 'center',
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.borderMid,
      marginBottom: Spacing.base,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.base,
    },
    title: {
      fontFamily: Typography.fonts.bold,
      fontSize: Typography.fontSizes.xl,
      color: colors.textPrimary,
    },
    reset: {
      fontFamily: Typography.fonts.semibold,
      fontSize: Typography.fontSizes.base,
      color: colors.primary,
    },
    group: {
      marginBottom: Spacing.lg,
    },
    groupLabel: {
      fontFamily: Typography.fonts.semibold,
      fontSize: Typography.fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: Spacing.md,
    },
    optionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    option: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.full,
      borderWidth: 1.5,
      borderColor: colors.borderMid,
      backgroundColor: colors.surface,
    },
    optionActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    optionText: {
      fontFamily: Typography.fonts.medium,
      fontSize: Typography.fontSizes.sm,
      color: colors.textSecondary,
    },
    optionTextActive: {
      color: colors.white,
    },
    apply: {
      marginTop: Spacing.sm,
      marginBottom: Spacing.base,
    },
  });
