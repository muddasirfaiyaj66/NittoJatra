import type { ErrorBoundaryProps } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState';
import { Spacing } from '@/constants/theme';
import { ThemeColors, useThemedStyles } from '@/theme/ThemeContext';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <EmptyState
          icon="warning-outline"
          title="Something went wrong"
          message={error.message || 'An unexpected error occurred. Please try again.'}
          action={<Button title="Try Again" onPress={() => retry()} />}
        />
        <Text style={styles.hint}>If the problem persists, restart the app.</Text>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.lg },
    hint: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: 12,
      marginTop: Spacing.base,
    },
  });
