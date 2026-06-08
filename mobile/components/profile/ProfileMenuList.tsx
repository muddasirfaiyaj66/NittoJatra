import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export interface ProfileMenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  route?: string;
}

interface ProfileMenuListProps {
  items: ProfileMenuItem[];
  onPress: (item: ProfileMenuItem) => void;
}

export function ProfileMenuList({ items, onPress }: ProfileMenuListProps) {
  return (
    <View style={styles.card}>
      {items.map((item) => (
        <Pressable
          key={item.title}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          onPress={() => onPress(item)}
          style={styles.row}
        >
          <View style={styles.iconWrap}>
            <Ionicons name={item.icon} size={20} color={Colors.textPrimary} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.chevronWrap}>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.xl,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: Radius.card,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.base,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.375,
    lineHeight: 22.5,
  },
  subtitle: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 15,
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
