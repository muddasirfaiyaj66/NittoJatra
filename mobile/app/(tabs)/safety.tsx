import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GradientButton } from '@/components/ui';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { TRUSTED_CONTACTS } from '@/constants/mock-data';

const SAFETY_TIPS = [
  { icon: 'shield-checkmark', title: 'Check Ride Details', desc: 'Verify driver and route before boarding' },
  { icon: 'car', title: 'Wear Seatbelt', desc: 'Always buckle up for your safety' },
  { icon: 'share-social', title: 'Share Your Trip', desc: 'Let someone know where you are' },
  { icon: 'call', title: 'Emergency Contacts', desc: 'Keep trusted contacts updated' },
];

export default function SafetyScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      <LinearGradient colors={[...Gradients.safetyHeader]} style={styles.header}>
        <Ionicons name="shield" size={48} color={Colors.white} />
        <Text style={styles.headerTitle}>Safety Center</Text>
        <Text style={styles.headerSub}>We&apos;re here to protect you 24/7</Text>
      </LinearGradient>

      <View style={[styles.sosCard, Shadows.card]}>
        <View style={styles.sosHeader}>
          <Ionicons name="warning" size={28} color={Colors.danger} />
          <View style={styles.sosText}>
            <Text style={styles.sosTitle}>Emergency SOS</Text>
            <View style={styles.priorityPill}>
              <Text style={styles.priorityText}>Priority Response</Text>
            </View>
          </View>
        </View>
        <Text style={styles.sosDesc}>Instantly alert emergency services and your trusted contacts with your live location.</Text>
        <GradientButton title="📞 CALL EMERGENCY SOS" variant="emergency" onPress={() => {}} />
      </View>

      <View style={[styles.card, Shadows.card]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Trusted Contact</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Add trusted contact" onPress={() => router.push('/modals/add-trusted-contact')}>
            <Text style={styles.addBtn}>+ Add</Text>
          </Pressable>
        </View>
        {TRUSTED_CONTACTS.map((c) => (
          <View key={c.id} style={styles.contactRow}>
            <View style={styles.contactAvatar}>
              <Text style={styles.contactInitial}>{c.initial}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={styles.contactPhone}>{c.phone}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${c.name}`}>
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </Pressable>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Safety Tips</Text>
      {SAFETY_TIPS.map((tip) => (
        <View key={tip.title} style={[styles.tipCard, Shadows.card]}>
          <View style={styles.tipIcon}>
            <Ionicons name={tip.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.primary} />
          </View>
          <View style={styles.tipText}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDesc}>{tip.desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: { alignItems: 'center', paddingTop: 80, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.xl },
  headerTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.white, marginTop: Spacing.md },
  headerSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
  sosCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.xl, marginHorizontal: Spacing.xl, marginTop: -Spacing.xxl },
  sosHeader: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  sosText: { flex: 1 },
  sosTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  priorityPill: { alignSelf: 'flex-start', backgroundColor: Colors.accentLight, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full, marginTop: 4 },
  priorityText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accent },
  sosDesc: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.base },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.xl, marginHorizontal: Spacing.xl, marginTop: Spacing.base },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.base },
  cardTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  addBtn: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  contactAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  contactInitial: { fontFamily: Typography.fonts.black, color: Colors.primary },
  contactInfo: { flex: 1 },
  contactName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  contactPhone: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  sectionTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary, marginHorizontal: Spacing.xl, marginTop: Spacing.xl, marginBottom: Spacing.md },
  tipCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginHorizontal: Spacing.xl, marginBottom: Spacing.sm, gap: Spacing.md },
  tipIcon: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  tipText: { flex: 1 },
  tipTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  tipDesc: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
});
