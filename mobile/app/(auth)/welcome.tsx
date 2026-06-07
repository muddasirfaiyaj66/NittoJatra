import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmbientBackground, GradientText } from '@/components/ui';
import { Colors, Gradients, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function WelcomeScreen() {
  const { setRole } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.33)).current;
  const dot3 = useRef(new Animated.Value(0.45)).current;

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

    const timer = setTimeout(() => {
      setShowActions(true);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 2200);

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
      clearTimeout(timer);
    };
  }, [dot1, dot2, dot3, fadeAnim]);

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
            <Ionicons name="car-sport" size={40} color={Colors.white} />
          </LinearGradient>
          <GradientText style={styles.wordmark} colors={Gradients.wordmark}>
            NittoJatra
          </GradientText>
          <Text style={styles.headline}>Commute</Text>
          <GradientText style={styles.tagline} colors={Gradients.welcomeTagline}>
            Without Limits
          </GradientText>
        </View>

        <View style={styles.dots}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View key={i} style={[styles.dot, i === 1 && styles.dotMid, { opacity: dot }]} />
          ))}
        </View>

        {showActions ? (
          <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
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
          </Animated.View>
        ) : (
          <View style={styles.actionsPlaceholder} />
        )}
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
    width: 117,
    height: 117,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '1.06deg' }],
    marginBottom: Spacing.lg,
  },
  wordmark: {
    fontSize: Typography.fontSizes.xl,
    lineHeight: 32,
    letterSpacing: 0,
    marginBottom: Spacing.xl,
  },
  headline: {
    fontFamily: Typography.fonts.bold,
    fontSize: 35,
    letterSpacing: -2.4,
    color: Colors.white,
    lineHeight: 40,
  },
  tagline: {
    fontSize: 35,
    lineHeight: 40,
    letterSpacing: -2.4,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  dot: {
    width: 6,
    height: 14,
    borderRadius: Radius.full,
    backgroundColor: '#995AF5',
  },
  dotMid: {
    height: 16,
  },
  actions: {
    gap: Spacing.md,
  },
  actionsPlaceholder: {
    height: 120,
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
