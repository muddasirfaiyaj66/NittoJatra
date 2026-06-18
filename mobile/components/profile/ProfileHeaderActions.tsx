import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';

interface ProfileHeaderActionsProps {
  onBack?: () => void;
  onLogout: () => void;
  showBack?: boolean;
  style?: ViewStyle;
}

export function ProfileHeaderActions({ onBack, onLogout, showBack = true, style }: ProfileHeaderActionsProps) {
  return (
    <View style={[styles.row, style]}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={styles.glassBtn}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </Pressable>
      ) : (
        <View style={styles.glassBtnPlaceholder} />
      )}
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
    paddingTop: 32,
    paddingBottom: 24,
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
  glassBtnPlaceholder: {
    width: 48,
    height: 48,
  },
  logoutBtn: {
    borderColor: 'rgba(244,63,94,0.2)',
  },
});
