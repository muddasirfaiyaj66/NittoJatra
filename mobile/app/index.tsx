import { Redirect } from 'expo-router';
import { homeRouteForRole } from '@/constants/routes';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { resolveActiveRole } from '@/utils/auth-routing';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';

export default function Index() {
  const { isAuthenticated, hasHydrated, role, user } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const activeRole = resolveActiveRole(user?.role, role);

  if (!hasHydrated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href={homeRouteForRole(activeRole)} />;
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
  });
