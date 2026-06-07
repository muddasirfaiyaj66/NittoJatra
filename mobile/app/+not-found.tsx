import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function NotFoundScreen() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  link: {
    marginTop: Spacing.base,
    paddingVertical: Spacing.base,
  },
  linkText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.base,
    fontWeight: '600',
  },
});
