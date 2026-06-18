import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export default function VerificationInfoModal() {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Verification Info</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.accentEmerald} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
          <Text style={styles.fieldLabel}>NATIONAL ID NUMBER</Text>
          <Text style={styles.fieldValue}>199526182739405</Text>
          {(['NID Front', 'NID Back'] as const).map((label) => (
            <View key={label} style={styles.nidTile}>
              <Ionicons name="document-outline" size={24} color={Colors.textMuted} />
              <Text style={styles.nidLabel}>{label}</Text>
            </View>
          ))}
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>VERIFIED ACCOUNT — Your identity has been confirmed.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  content: { padding: Spacing.xl, gap: Spacing.base },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, alignSelf: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full },
  verifiedText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.accentEmerald },
  fieldLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  fieldValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  nidTile: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surfaceMuted, borderRadius: Radius.lg, padding: Spacing.base },
  nidLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  noteCard: { backgroundColor: Colors.surfaceIndigo, borderRadius: Radius.lg, padding: Spacing.base },
  noteText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary, letterSpacing: 0.5 },
});
