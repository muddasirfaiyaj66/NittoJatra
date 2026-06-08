import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Typography } from '@/constants/theme';

export interface ProfileStat {
  label: string;
  value: string;
  gold?: boolean;
  showStar?: boolean;
}

interface ProfileStatsRowProps {
  stats: ProfileStat[];
}

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  return (
    <View style={styles.row}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.box}>
          <View style={styles.valueRow}>
            {stat.showStar ? <Ionicons name="star" size={14} color={Colors.gold} /> : null}
            <Text style={[styles.value, stat.gold && styles.valueGold]}>{stat.value}</Text>
          </View>
          <Text style={styles.label}>{stat.label.toUpperCase()}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  box: {
    flex: 1,
    maxWidth: 106,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 13,
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  value: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 20,
  },
  valueGold: {
    color: Colors.gold,
  },
  label: {
    fontFamily: Typography.fonts.bold,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.9,
    lineHeight: 13.5,
  },
});
