import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

const APP_ICON = require('../../assets/figma/app-icon-car.png');

export default function LoginScreen() {
  const { login, isLoading, error, clearError, role, setRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role === 'driver' ? 1 : 0);

  const handleRoleChange = (index: number) => {
    setSelectedRole(index);
    setRole(index === 0 ? 'rider' : 'driver');
  };

  const handleLogin = async () => {
    clearError();
    const userRole: UserRole = selectedRole === 0 ? 'rider' : 'driver';
    const loginEmail = email.trim() || 'demo@nittojatra.com';
    const loginPassword = password || 'demo1234';
    try {
      await login(loginEmail, loginPassword, userRole);
      router.replace(userRole === 'driver' ? ROUTES.driverTabs : ROUTES.riderTabs);
    } catch {
      // error in store
    }
  };

  return (
    <AmbientBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.page}>
            {/* Header block — Figma 168px */}
            <View style={styles.header}>
              <View style={styles.iconWrap}>
                <LinearGradient colors={[...Gradients.appIcon]} style={styles.logo}>
                  <Image source={APP_ICON} style={styles.logoImage} contentFit="contain" />
                </LinearGradient>
              </View>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Welcome </Text>
                <GradientText style={styles.titleAccent}>Back.</GradientText>
              </View>
              <Text style={styles.subtitle}>Enter credentials to continue</Text>
            </View>

            {/* Frosted card — Figma 336px */}
            <GlassCard>
              <SegmentedControl
                dark
                options={['Rider', 'Driver']}
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
                    autoCorrect={false}
                    style={styles.input}
                  />
                </View>

                <View style={styles.passwordBlock}>
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
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={Colors.textMuted}
                      />
                    </Pressable>
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel="Forgot password" style={styles.forgot}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </Pressable>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.actions}>
                  <GradientButton
                    title="Sign In"
                    onPress={handleLogin}
                    loading={isLoading}
                    style={styles.signInBtn}
                    icon={<Ionicons name="arrow-forward" size={16} color={Colors.white} />}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Create new account"
                    onPress={() => router.push('/(auth)/register')}
                    style={styles.secondaryBtn}
                  >
                    <Ionicons name="person-add-outline" size={14} color="#CBD5E1" />
                    <Text style={styles.secondaryText}>Create New Account</Text>
                  </Pressable>
                </View>
              </View>
            </GlassCard>

            <Text style={styles.footer}>
              Secured by Nitto
              <Text style={styles.footerAccent}>Shield</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxxl,
    maxWidth: 384,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    height: 168,
    alignItems: 'center',
  },
  iconWrap: {
    position: 'absolute',
    top: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '1.06deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  titleRow: {
    position: 'absolute',
    top: 104,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.display,
    letterSpacing: Typography.letterSpacing.tight,
    color: Colors.white,
    lineHeight: 40,
  },
  titleAccent: {
    fontSize: Typography.fontSizes.display,
    lineHeight: 40,
  },
  subtitle: {
    position: 'absolute',
    top: 152,
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    letterSpacing: Typography.letterSpacing.subtitle,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    lineHeight: 16,
    textAlign: 'center',
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
    paddingVertical: 0,
  },
  passwordBlock: {
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
    lineHeight: 15,
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
  signInBtn: {
    width: '100%',
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
    lineHeight: 15,
  },
  footer: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: Typography.letterSpacing.buttonSm,
    color: Colors.textFaint,
    textTransform: 'uppercase',
    lineHeight: 15,
    textAlign: 'center',
  },
  footerAccent: {
    color: Colors.primaryGradStart,
  },
});
