import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';

interface ProfileHeaderActionsProps {
  onBack?: () => void;
  onLogout: () => void;
  style?: ViewStyle;
}

export function ProfileHeaderActions({ onBack, onLogout, style }: ProfileHeaderActionsProps) {
  return (
    <View style={[styles.row, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={styles.glassBtn}
      >
        <Ionicons name="arrow-back" size={20} color={Colors.white} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Logout"
        onPress={onLogout}
        style={[styles.glassBtn, styles.logoutBtn]}
      >
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    zIndex: 2,
  },
  glassBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  logoutBtn: {
    borderColor: 'rgba(244,63,94,0.2)',
  },
});
