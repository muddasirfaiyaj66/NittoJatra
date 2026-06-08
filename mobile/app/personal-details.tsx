import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const RIDER_AVATAR = require('../assets/figma/avatar-rider.png');
const DRIVER_AVATAR = require('../assets/figma/avatar-driver.png');

export default function PersonalDetailsScreen() {
  const { user, updateUser, role } = useAuth();
  const isDriver = (user?.role ?? role) === 'driver';
  const avatarSource = isDriver ? DRIVER_AVATAR : RIDER_AVATAR;
  const defaultName = isDriver ? 'Karim Uddin' : 'Ahmed Rahman';
  const defaultEmail = isDriver ? 'captain@example.com' : 'rider@example.com';
  const [name, setName] = useState(user?.name ?? defaultName);
  const [email, setEmail] = useState(user?.email ?? defaultEmail);
  const [phone, setPhone] = useState(user?.phone ?? '+8801712345678');
  const [emergency, setEmergency] = useState(user?.emergencyContact ?? '+8801700000000');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        emergencyContact: emergency.trim(),
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const tierLabel = user?.tier ?? 'GOLD';

  return (
    <View style={styles.root}>
      <LinearGradient colors={[...Gradients.navyHeader]} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.nav}>
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </Pressable>
            <Text style={styles.navTitle}>Personal Details</Text>
            <View style={styles.back} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.identityCard, Shadows.card]}>
          <View style={styles.avatarFrame}>
            <Image source={avatarSource} style={styles.avatar} contentFit="cover" />
          </View>
          <Text style={styles.identityName}>{name}</Text>
          <LinearGradient colors={['#FBBF24', '#F97316']} style={styles.tierPill}>
            <Ionicons name="ribbon" size={12} color={Colors.white} />
            <Text style={styles.tierText}>{tierLabel}</Text>
          </LinearGradient>
          <Text style={styles.memberSince}>Member since {user?.memberSince ?? '2024-01-15'}</Text>
        </View>

        <Text style={styles.sectionLabel}>CONTACT INFORMATION</Text>
        <View style={[styles.formCard, Shadows.card]}>
          <Field label="Full Name" value={name} onChangeText={setName} />
          <Field label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Field label="Emergency Contact" value={emergency} onChangeText={setEmergency} keyboardType="phone-pad" isLast />
        </View>

        <Text style={styles.sectionLabel}>RIDE STATS</Text>
        <View style={styles.statsRow}>
          <StatBox label="RATING" value={`★ ${user?.rating ?? 4.8}`} gold />
          <StatBox label="TOTAL RIDES" value={String(user?.totalTrips ?? 0)} />
          <StatBox label="POINTS" value={String(user?.points ?? 0)} />
        </View>

        <GradientButton title="SAVE CHANGES" onPress={handleSave} loading={saving} style={styles.saveBtn} />
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  isLast,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'email-address' | 'phone-pad' | 'default';
  autoCapitalize?: 'none' | 'sentences';
  isLast?: boolean;
}) {
  return (
    <View style={[styles.field, !isLast && styles.fieldBorder]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.input}
        placeholderTextColor={Colors.textMuted}
      />
    </View>
  );
}

function StatBox({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, gold && styles.statGold]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: Spacing.xl },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  back: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.lg,
    color: Colors.white,
    letterSpacing: Typography.letterSpacing.h2,
  },
  scroll: { padding: Spacing.xl, paddingBottom: 48, gap: Spacing.sm },
  identityCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  avatarFrame: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.white,
    padding: 4,
    marginBottom: Spacing.md,
    ...Shadows.float,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 44 },
  identityName: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.heading,
    marginBottom: Spacing.sm,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  tierText: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  memberSince: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.stat,
  },
  sectionLabel: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.subtitle,
    textTransform: 'uppercase',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  field: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  fieldLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  input: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    paddingVertical: 4,
  },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statGold: { color: Colors.gold },
  statLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  saveBtn: { marginTop: Spacing.xl },
});
