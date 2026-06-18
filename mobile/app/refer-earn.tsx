import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function ReferEarnScreen() {
  const { user } = useAuth();
  const referralCode = `NITTO-${(user?.id ?? 'GUEST').slice(-6).toUpperCase()}`;

  const share = async () => {
    await Share.share({ message: `Join NittoJatra with my code ${referralCode} and get a free ride!` });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Refer & Earn</Text>
          <View style={styles.back} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[...Gradients.ctaPrimary]} style={styles.heroCard}>
          <Ionicons name="gift" size={40} color={Colors.white} />
          <Text style={styles.heroTitle}>Invite Friends, Get Rides</Text>
          <Text style={styles.heroSub}>Earn 1 free ride for every friend who completes their first trip</Text>
        </LinearGradient>

        <View style={[styles.codeCard, Shadows.card]}>
          <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
          <Text style={styles.code}>{referralCode}</Text>
          <GradientButton title="SHARE CODE" onPress={share} />
        </View>

        <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
        {[
          { step: '1', title: 'Share your code', sub: 'Send to friends via message or social' },
          { step: '2', title: 'Friend signs up', sub: 'They register using your referral code' },
          { step: '3', title: 'Both earn rewards', sub: 'Free ride credited after first completed trip' },
        ].map((s) => (
          <View key={s.step} style={[styles.stepRow, Shadows.card]}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>{s.step}</Text></View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepSub}>{s.sub}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary, letterSpacing: Typography.letterSpacing.heading },
  scroll: { padding: Spacing.xl, paddingBottom: 40, gap: Spacing.base },
  heroCard: { borderRadius: Radius.card, padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  heroTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.white, textAlign: 'center' },
  heroSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20 },
  codeCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.xl, alignItems: 'center', gap: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  codeLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  code: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.primary, letterSpacing: 2 },
  sectionLabel: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.textMuted, letterSpacing: Typography.letterSpacing.subtitle, textTransform: 'uppercase', marginTop: Spacing.md },
  stepRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.base, borderWidth: 1, borderColor: Colors.border },
  stepNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  stepText: { flex: 1 },
  stepTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  stepSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
});
