import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { Strings } from '@/constants/strings';
import { useAuth } from '@/hooks/useAuth';

export default function WelcomeScreen() {
  const { loginAsGuest, isLoading } = useAuth();

  const handleGuest = async () => {
    try {
      await loginAsGuest();
      router.replace('/(tabs)');
    } catch {
      // handled in store
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark, Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <View style={styles.logoBadge}>
            <Ionicons name="bus" size={44} color={Colors.white} />
          </View>
          <Text style={styles.wordmark}>{Strings.appName.en}</Text>
          <Text style={styles.wordmarkBn}>{Strings.appName.bn}</Text>
          <Text style={styles.tagline}>{Strings.tagline.bn}</Text>
          <Text style={styles.taglineEn}>{Strings.tagline.en}</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title={Strings.login.en}
            variant="primary"
            size="lg"
            style={styles.loginBtn}
            textColor={Colors.primary}
            onPress={() => router.push('/(auth)/login')}
          />
          <Button
            title={Strings.register.en}
            variant="outline"
            size="lg"
            style={styles.registerBtn}
            onPress={() => router.push('/(auth)/register')}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={Strings.continueGuest.en}
            onPress={handleGuest}
            disabled={isLoading}
            style={styles.guestLink}
          >
            <Text style={styles.guestText}>{Strings.continueGuest.en}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: Radius.xl,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  wordmark: {
    fontFamily: Typography.fonts.extrabold,
    fontSize: Typography.fontSizes.display,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  wordmarkBn: {
    fontFamily: Typography.fonts.bengaliBold,
    fontSize: Typography.fontSizes.xl,
    color: 'rgba(255,255,255,0.92)',
    marginTop: Spacing.xs,
  },
  tagline: {
    fontFamily: Typography.fonts.bengali,
    fontSize: Typography.fontSizes.md,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 26,
  },
  taglineEn: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  actions: {
    gap: Spacing.md,
  },
  loginBtn: {
    backgroundColor: Colors.white,
  },
  registerBtn: {
    borderColor: Colors.white,
  },
  guestLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  guestText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.base,
    color: 'rgba(255,255,255,0.9)',
    textDecorationLine: 'underline',
  },
});
