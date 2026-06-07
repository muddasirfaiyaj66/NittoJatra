import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '@/constants/theme';
import { ThemeColors, useThemedStyles } from '@/theme/ThemeContext';

export default function NotFoundScreen() {
  const styles = useThemedStyles(makeStyles);
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: Typography.fontSizes.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    link: {
      marginTop: Spacing.base,
      paddingVertical: Spacing.base,
    },
    linkText: {
      color: colors.primary,
      fontSize: Typography.fontSizes.base,
      fontWeight: '600',
    },
  });
