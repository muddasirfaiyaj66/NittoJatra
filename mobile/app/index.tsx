import { Redirect } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';

export default function Index() {
  const { isAuthenticated, hasHydrated, role } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

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

  return <Redirect href={role === 'driver' ? ROUTES.driverTabs : ROUTES.riderTabs} />;
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
