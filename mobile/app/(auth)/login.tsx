import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmbientBackground, GlassCard, GradientButton, GradientText } from '@/components/ui';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Colors, Gradients, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

export default function LoginScreen() {
  const { login, isLoading, error, clearError, role, setRole } = useAuth();
  const [email, setEmail] = useState('demo@nittojatra.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role === 'driver' ? 1 : 0);

  const handleRoleChange = (index: number) => {
    setSelectedRole(index);
    setRole(index === 0 ? 'rider' : 'driver');
  };

  const handleLogin = async () => {
    clearError();
    const userRole: UserRole = selectedRole === 0 ? 'rider' : 'driver';
    try {
      await login(email, password, userRole);
      router.replace(userRole === 'driver' ? ROUTES.driverTabs : ROUTES.riderTabs);
    } catch {
      // error in store
    }
  };

  return (
    <AmbientBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <LinearGradient colors={[...Gradients.appIcon]} style={styles.logo}>
              <Ionicons name="car-sport" size={32} color={Colors.white} />
            </LinearGradient>

            <View style={styles.titleRow}>
              <Text style={styles.title}>Welcome </Text>
              <GradientText style={styles.titleGradient}>Back.</GradientText>
            </View>
            <Text style={styles.subtitle}>ENTER CREDENTIALS TO CONTINUE</Text>

            <GlassCard style={styles.card}>
              <SegmentedControl
                dark
                options={['RIDER', 'DRIVER']}
                selected={selectedRole}
                onChange={handleRoleChange}
              />

              <View style={styles.form}>
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    accessibilityLabel="Email Address"
                    placeholder="Email Address"
                    placeholderTextColor={Colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <View style={styles.passwordGroup}>
                  <View style={styles.inputWrap}>
                    <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                    <TextInput
                      accessibilityLabel="Password"
                      placeholder="Password"
                      placeholderTextColor={Colors.textMuted}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      style={styles.input}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      onPress={() => setShowPassword((s) => !s)}
                      style={styles.eyeBtn}
                    >
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
                    </Pressable>
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel="Forgot password" style={styles.forgot}>
                    <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
                  </Pressable>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.actions}>
                  <GradientButton title="SIGN IN" onPress={handleLogin} loading={isLoading} icon={<Ionicons name="arrow-forward" size={16} color={Colors.white} />} />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Create new account"
                    onPress={() => router.push('/(auth)/register')}
                    style={styles.secondaryBtn}
                  >
                    <Ionicons name="person-add-outline" size={14} color="#CBD5E1" />
                    <Text style={styles.secondaryText}>CREATE NEW ACCOUNT</Text>
                  </Pressable>
                </View>
              </View>
            </GlassCard>

            <Text style={styles.footer}>
              SECURED BY NITTO<Text style={styles.footerAccent}>SHIELD</Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxxl,
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '1.06deg' }],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.display,
    letterSpacing: Typography.letterSpacing.tight,
    color: Colors.white,
    lineHeight: 40,
  },
  titleGradient: {
    fontSize: Typography.fontSizes.display,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    letterSpacing: Typography.letterSpacing.subtitle,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    lineHeight: 16,
    marginTop: -Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 336,
  },
  form: {
    gap: Spacing.lg,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glassInput,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.xl,
    height: 64,
  },
  inputIcon: {
    marginRight: Spacing.base,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.white,
    lineHeight: 20,
  },
  passwordGroup: {
    gap: 7,
  },
  eyeBtn: {
    padding: 6,
  },
  forgot: {
    alignSelf: 'flex-end',
    paddingRight: Spacing.xs,
  },
  forgotText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: 1,
    color: Colors.indigo400,
    textTransform: 'uppercase',
  },
  error: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: Colors.danger,
  },
  actions: {
    gap: Spacing.md,
    paddingTop: Spacing.base,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.glassInput,
    borderWidth: 1,
    borderColor: Colors.glassBorderSubtle,
    borderRadius: Radius.lg,
    height: 56,
  },
  secondaryText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: Typography.letterSpacing.buttonSm,
    color: '#CBD5E1',
    textTransform: 'uppercase',
  },
  footer: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: Typography.letterSpacing.buttonSm,
    color: Colors.textFaint,
    textTransform: 'uppercase',
  },
  footerAccent: {
    color: Colors.primaryGradStart,
  },
});
