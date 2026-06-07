import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmbientBackground } from '@/components/ui';
import { Colors, Gradients, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function WelcomeScreen() {
  const { setRole } = useAuth();
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 600, useNativeDriver: true }),
        ]),
      );
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const goLogin = (role: 'rider' | 'driver') => {
    setRole(role);
    router.push('/(auth)/login');
  };

  return (
    <AmbientBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <LinearGradient colors={[...Gradients.appIcon]} style={styles.logo}>
            <Ionicons name="car-sport" size={36} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.wordmark}>NittoJatra</Text>
          <Text style={styles.headline}>Commute</Text>
          <Text style={styles.headlineAccent}>Without Limits</Text>
        </View>

        <View style={styles.dots}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="I'm a Rider"
            onPress={() => goLogin('rider')}
            style={styles.roleBtn}
          >
            <Ionicons name="person" size={20} color={Colors.white} />
            <Text style={styles.roleText}>I&apos;m a Rider</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="I'm a Captain"
            onPress={() => goLogin('driver')}
            style={[styles.roleBtn, styles.roleBtnAlt]}
          >
            <Ionicons name="car" size={20} color={Colors.indigo400} />
            <Text style={[styles.roleText, styles.roleTextAlt]}>I&apos;m a Captain</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '1.06deg' }],
    marginBottom: Spacing.lg,
  },
  wordmark: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.lg,
    color: Colors.primary,
    marginBottom: Spacing.xl,
  },
  headline: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.display,
    letterSpacing: Typography.letterSpacing.tight,
    color: Colors.white,
    lineHeight: 40,
  },
  headlineAccent: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.display,
    letterSpacing: Typography.letterSpacing.tight,
    color: Colors.indigo400,
    lineHeight: 40,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  actions: {
    gap: Spacing.md,
  },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: Radius.lg,
  },
  roleBtnAlt: {
    backgroundColor: Colors.glassInput,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  roleText: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.sm,
    letterSpacing: Typography.letterSpacing.button,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  roleTextAlt: {
    color: Colors.indigo400,
  },
});
