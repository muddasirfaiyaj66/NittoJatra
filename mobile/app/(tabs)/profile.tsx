import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui';
import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useSettingsStore } from '@/store/settings.store';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';

export { ErrorBoundary } from '@/components/shared/RouteError';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const language = useSettingsStore((s) => s.language);
  const notifications = useSettingsStore((s) => s.notifications);
  const themeMode = useSettingsStore((s) => s.themeMode);
  const toggleLanguage = useSettingsStore((s) => s.toggleLanguage);
  const setNotifications = useSettingsStore((s) => s.setNotifications);
  const toggleDarkMode = useSettingsStore((s) => s.toggleDarkMode);

  const memberSince = user?.memberSince
    ? format(new Date(user.memberSince), 'MMM yyyy')
    : '—';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatarWrap}>
            <Avatar uri={user?.avatar} name={user?.name} size={84} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profile photo"
              style={styles.editOverlay}
            >
              <Ionicons name="camera" size={16} color={colors.white} />
            </Pressable>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Guest User'}</Text>
          <Text style={styles.phone}>{user?.phone ?? '—'}</Text>
          <Text style={styles.memberSince}>Member since {memberSince}</Text>

          <View style={styles.statsRow}>
            <Stat label="Trips" value={String(user?.totalTrips ?? 0)} />
            <View style={styles.statDivider} />
            <Stat label="Total Spent" value={`৳${user?.totalSpent ?? 0}`} />
            <View style={styles.statDivider} />
            <Stat label="Points" value={String(user?.points ?? 0)} />
          </View>
        </View>

        {/* Account */}
        <Section title="Account">
          <MenuRow icon="person-outline" label="Edit Profile" />
          <MenuRow icon="lock-closed-outline" label="Change Password" />
          <MenuRow icon="bookmark-outline" label="Saved Addresses" last />
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <MenuRow
            icon="language-outline"
            label="Language"
            right={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle language"
                onPress={toggleLanguage}
                style={styles.langToggle}
              >
                <Text style={styles.langText}>{language === 'en' ? 'English' : 'বাংলা'}</Text>
                <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
              </Pressable>
            }
          />
          <MenuRow
            icon="notifications-outline"
            label="Notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ true: colors.primary, false: colors.borderMid }}
                thumbColor={colors.white}
              />
            }
          />
          <MenuRow
            icon="moon-outline"
            label="Dark Mode"
            last
            right={
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleDarkMode}
                trackColor={{ true: colors.primary, false: colors.borderMid }}
                thumbColor={colors.white}
              />
            }
          />
        </Section>

        {/* Support */}
        <Section title="Support">
          <MenuRow icon="help-circle-outline" label="Help Center" />
          <MenuRow icon="document-text-outline" label="Terms & Conditions" />
          <MenuRow icon="shield-checkmark-outline" label="Privacy Policy" />
          <MenuRow icon="star-outline" label="Rate the App" last />
        </Section>

        {/* Danger */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Logout"
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>NittoJatra v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  right,
  last,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  right?: ReactNode;
  last?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.menuRow, !last && styles.menuBorder]}
    >
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {right ?? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: Spacing.section },
  headerCard: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  avatarWrap: {
    position: 'relative',
  },
  editOverlay: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  name: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xl,
    color: colors.textPrimary,
    marginTop: Spacing.md,
  },
  phone: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memberSince: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: Spacing.base,
    marginTop: Spacing.lg,
    alignSelf: 'stretch',
    ...Shadows.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Typography.fonts.extrabold,
    fontSize: Typography.fontSizes.lg,
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: colors.borderMid,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.sm,
    color: colors.textMuted,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: Spacing.base,
    ...Shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  menuBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.base,
    color: colors.textPrimary,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  langText: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: colors.danger,
    backgroundColor: colors.surface,
  },
  logoutText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: colors.danger,
  },
  version: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
