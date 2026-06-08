import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
import { AmbientBackground, GradientButton, GradientText } from '@/components/ui';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';
import { navigateToRoleHome } from '@/utils/auth-routing';

type Step = 'credentials' | 'identity' | 'vehicle' | 'success';

const STEPS: Step[] = ['credentials', 'identity', 'vehicle', 'success'];

export default function RegisterScreen() {
  const { register, isLoading, role, setLoginRole } = useAuth();
  const [step, setStep] = useState<Step>('credentials');
  const [selectedRole, setSelectedRole] = useState(0);

  const userRole: UserRole = selectedRole === 0 ? 'rider' : 'driver';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nid, setNid] = useState('');
  const [vehicleType, setVehicleType] = useState(0);
  const [regNumber, setRegNumber] = useState('');
  const stepIndex = STEPS.indexOf(step);
  const totalSteps = userRole === 'driver' ? 4 : 3;

  const handleRoleChange = (index: number) => {
    setSelectedRole(index);
    setLoginRole(index === 0 ? 'rider' : 'driver');
  };

  const next = () => {
    if (step === 'credentials') setStep('identity');
    else if (step === 'identity') setStep(userRole === 'driver' ? 'vehicle' : 'success');
    else if (step === 'vehicle') setStep('success');
  };

  const handleFinish = async () => {
    await register({
      name: name || 'New User',
      email: email || 'new@nittojatra.com',
      phone: '+8801700000000',
      password: password || 'password123',
      gender: 'other',
      role: userRole,
    });
    navigateToRoleHome(useAuthStore.getState().role);
  };

  return (
    <AmbientBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </Pressable>

            <View style={styles.titleRow}>
              <Text style={styles.title}>Create </Text>
              <GradientText style={styles.titleGradient}>Account</GradientText>
            </View>

            <View style={styles.progressRow}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <View key={i} style={styles.progressSegment}>
                  {i <= stepIndex ? (
                    <LinearGradient colors={['#4F46E5', '#10B981']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.progressFill} />
                  ) : (
                    <View style={styles.progressEmpty} />
                  )}
                </View>
              ))}
            </View>

            {step === 'credentials' && (
              <View style={styles.stepContent}>
                <Text style={styles.stepLabel}>I AM A</Text>
                <SegmentedControl dark options={['RIDER', 'DRIVER']} selected={selectedRole} onChange={handleRoleChange} />
                {(['Full Legal Name', 'Email Address'] as const).map((label, i) => (
                  <View key={label} style={styles.inputWrap}>
                    <TextInput
                      accessibilityLabel={label}
                      placeholder={label}
                      placeholderTextColor={Colors.textMuted}
                      value={i === 0 ? name : email}
                      onChangeText={i === 0 ? setName : setEmail}
                      style={styles.input}
                      autoCapitalize={i === 0 ? 'words' : 'none'}
                    />
                  </View>
                ))}
                {(['Create Password', 'Confirm Password'] as const).map((label, i) => (
                  <View key={label} style={styles.inputWrap}>
                    <TextInput
                      accessibilityLabel={label}
                      placeholder={label}
                      placeholderTextColor={Colors.textMuted}
                      secureTextEntry
                      value={i === 0 ? password : confirmPassword}
                      onChangeText={i === 0 ? setPassword : setConfirmPassword}
                      style={styles.input}
                    />
                  </View>
                ))}
                <GradientButton title="CONTINUE" variant="register" onPress={next} />
              </View>
            )}

            {step === 'identity' && (
              <View style={styles.stepContent}>
                <Text style={styles.h2}>Identity Check</Text>
                <Text style={styles.desc}>Verify your NID for a trusted community.</Text>
                <View style={styles.inputWrap}>
                  <TextInput accessibilityLabel="NID Number" placeholder="NID Number" placeholderTextColor={Colors.textMuted} value={nid} onChangeText={setNid} style={styles.input} keyboardType="number-pad" />
                </View>
                {(['NID (Front)', 'NID (Back)'] as const).map((label) => (
                  <Pressable key={label} accessibilityRole="button" accessibilityLabel={`Upload ${label}`} style={styles.uploadCard}>
                    <Ionicons name="cloud-upload-outline" size={24} color={Colors.textMuted} />
                    <View style={styles.uploadText}>
                      <Text style={styles.uploadTitle}>{label}</Text>
                      <Text style={styles.uploadSub}>REQUIRED PHOTO</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                  </Pressable>
                ))}
                <GradientButton title="VERIFY & FINISH" variant="register" onPress={next} />
              </View>
            )}

            {step === 'vehicle' && userRole === 'driver' && (
              <View style={styles.stepContent}>
                <Text style={styles.stepLabel}>PREFERRED VEHICLE</Text>
                <SegmentedControl dark options={['CAR', 'BIKE', 'MICRO', 'BUS']} selected={vehicleType} onChange={setVehicleType} />
                <View style={styles.inputWrap}>
                  <TextInput accessibilityLabel="Registration Number" placeholder="Registration Number" placeholderTextColor={Colors.textMuted} value={regNumber} onChangeText={setRegNumber} style={styles.input} />
                </View>
                <View style={styles.noteCard}>
                  <Text style={styles.noteText}>Verification takes ~24h. You can start posting routes once approved.</Text>
                </View>
                <GradientButton title="SUBMIT REGISTRATION" variant="register" onPress={next} />
              </View>
            )}

            {step === 'success' && (
              <View style={styles.stepContent}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={64} color={Colors.accentEmerald} />
                </View>
                <Text style={styles.h2}>You&apos;re In!</Text>
                <Text style={styles.desc}>Your profile is ready for takeoff</Text>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>AUTHENTICATED AS</Text>
                  <Text style={styles.infoValue}>{name || 'New User'}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>EMAIL IDENTIFIER</Text>
                  <Text style={styles.infoValue}>{email || 'new@nittojatra.com'}</Text>
                </View>
                <GradientButton title="GET STARTED" variant="register" onPress={handleFinish} loading={isLoading} />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  back: { width: 40, height: 40, justifyContent: 'center', marginTop: Spacing.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: Spacing.md },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.white },
  titleGradient: { fontSize: Typography.fontSizes.xl, lineHeight: 32 },
  progressRow: { flexDirection: 'row', gap: Spacing.sm, marginVertical: Spacing.xl },
  progressSegment: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { flex: 1 },
  progressEmpty: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  stepContent: { gap: Spacing.base },
  stepLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: Typography.letterSpacing.eyebrow,
    color: Colors.textMuted,
  },
  h2: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.lg,
    color: Colors.white,
  },
  desc: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  inputWrap: {
    backgroundColor: Colors.glassInput,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    height: 56,
    justifyContent: 'center',
  },
  input: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.white,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.glassInput,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: Radius.lg,
    padding: Spacing.base,
  },
  uploadText: { flex: 1 },
  uploadTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.white },
  uploadSub: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  noteCard: {
    backgroundColor: Colors.glassFillSubtle,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  noteText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  successIcon: { alignItems: 'center', marginVertical: Spacing.lg },
  infoCard: {
    backgroundColor: Colors.glassInput,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  infoLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  infoValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.white, marginTop: 4 },
});
