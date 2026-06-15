import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const SAFETY_TIPS = [
  {
    title: 'Check Ride Details',
    desc: 'Always verify car plate number and drive identity.',
  },
  {
    title: 'Share Your Trip',
    desc: 'Use the "Share Ride" feature to let loved ones know your location.',
  },
  {
    title: 'Wear Seatbelt',
    desc: 'Sit back and buckle up for a safe journey',
  },
];

export default function SafetyScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const trustedContacts = user?.emergencyContact
    ? [{ id: 'primary', name: 'Emergency Contact', phone: user.emergencyContact, initial: user.name.charAt(0) }]
    : [];

  const handleSos = () => {
    if (trustedContacts.length > 0) {
      Linking.openURL(`tel:${trustedContacts[0].phone}`);
    } else {
      Linking.openURL('tel:999');
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#F9FAFB', 'rgba(254,242,242,0.2)', 'rgba(253,242,248,0.1)']} style={styles.pageGradient}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#EF4444', '#DB2777']} style={[styles.header, { paddingTop: insets.top + 48 }]}>
            <View style={styles.headerOrbTop} />
            <View style={styles.headerOrbBottom} />
            <View style={styles.shieldCircle}>
              <Ionicons name="shield" size={40} color={Colors.white} />
            </View>
            <Text style={styles.headerTitle}>Safety Center</Text>
            <Text style={styles.headerSub}>We&apos;re here to protect you 24/7</Text>
          </LinearGradient>

          <View style={[styles.sosCard, Shadows.card]}>
            <LinearGradient colors={['rgba(239,68,68,0.1)', 'rgba(236,72,153,0.1)']} style={styles.sosOrb} />
            <View style={styles.sosHeader}>
              <LinearGradient colors={['#EF4444', '#DB2777']} style={styles.sosIconBox}>
                <Ionicons name="warning" size={24} color={Colors.white} />
              </LinearGradient>
              <View style={styles.sosTitleBlock}>
                <Text style={styles.sosTitle}>Emergency SOS</Text>
                <View style={styles.priorityPill}>
                  <Text style={styles.priorityText}>Priority Response</Text>
                </View>
              </View>
            </View>
            <Text style={styles.sosDesc}>
              Immediate assistance for urgent situations. Track your location and alerts authorities instantly
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Call Emergency SOS" onPress={handleSos}>
              <LinearGradient colors={['#DC2626', '#DB2777']} style={styles.sosButton}>
                <Ionicons name="call" size={20} color={Colors.white} />
                <Text style={styles.sosButtonText}>Call Emergency SOS</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={[styles.card, Shadows.card]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Trusted Contact</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add trusted contact"
                onPress={() => router.push('/modals/add-trusted-contact')}
                style={styles.addBtn}
              >
                <Ionicons name="add" size={16} color={Colors.primary} />
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
            </View>
            {trustedContacts.length === 0 ? (
              <Text style={styles.emptyContact}>Add your emergency contact from profile settings.</Text>
            ) : (
              trustedContacts.map((c) => (
                <View key={c.id} style={styles.contactRow}>
                  <View style={styles.contactLeft}>
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactInitial}>{c.initial}</Text>
                    </View>
                    <View>
                      <Text style={styles.contactName}>{c.name}</Text>
                      <Text style={styles.contactPhone}>{c.phone}</Text>
                    </View>
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${c.name}`} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
                  </Pressable>
                </View>
              ))
            )}
          </View>

          <Text style={styles.sectionTitle}>Safety Tips</Text>
          {SAFETY_TIPS.map((tip) => (
            <View key={tip.title} style={[styles.tipCard, Shadows.card]}>
              <View style={styles.tipIcon}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.accentEmerald} />
              </View>
              <View style={styles.tipText}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDesc}>{tip.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  pageGradient: { flex: 1 },
  scroll: { paddingBottom: 120 },
  header: {
    alignItems: 'center',
    minHeight: 232,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  headerOrbTop: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerOrbBottom: {
    position: 'absolute',
    bottom: -48,
    left: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  shieldCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Shadows.float,
  },
  headerTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: 30,
    color: Colors.white,
    letterSpacing: -0.75,
    lineHeight: 36,
  },
  headerSub: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: '#FEE2E2',
    letterSpacing: -0.3,
    lineHeight: 20,
    marginTop: 8,
  },
  sosCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 25.6,
    marginHorizontal: 20,
    marginTop: 24,
    overflow: 'hidden',
  },
  sosOrb: {
    position: 'absolute',
    top: -63.4,
    right: -63.4,
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  sosHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  sosIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.float,
  },
  sosTitleBlock: { flex: 1, gap: 4 },
  sosTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: 18,
    color: '#111827',
    letterSpacing: -0.45,
    lineHeight: 28,
  },
  priorityPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  priorityText: {
    fontFamily: Typography.fonts.medium,
    fontSize: 10,
    color: '#B91C1C',
    letterSpacing: -0.3,
    lineHeight: 15,
  },
  sosDesc: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: '#4B5563',
    letterSpacing: -0.3,
    lineHeight: 20,
    marginBottom: 12,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 60,
    borderRadius: 16,
    ...Shadows.float,
  },
  sosButtonText: {
    fontFamily: Typography.fonts.bold,
    fontSize: 15,
    color: Colors.white,
    letterSpacing: -0.3,
    lineHeight: 22.5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 20.8,
    marginHorizontal: 20,
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: 18,
    color: '#111827',
    letterSpacing: -0.45,
    lineHeight: 28,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceIndigo,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addBtnText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.primary,
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  contactLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInitial: {
    fontFamily: Typography.fonts.bold,
    fontSize: 15,
    color: Colors.primary,
    letterSpacing: -0.3,
    lineHeight: 22.5,
  },
  contactName: {
    fontFamily: Typography.fonts.bold,
    fontSize: 15,
    color: '#111827',
    letterSpacing: -0.375,
    lineHeight: 22.5,
  },
  contactPhone: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: '#6B7280',
    letterSpacing: -0.3,
    lineHeight: 16,
  },
  emptyContact: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    paddingVertical: Spacing.sm,
  },
  deleteBtn: { padding: 8, borderRadius: Radius.full },
  sectionTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: 18,
    color: '#111827',
    letterSpacing: -0.45,
    lineHeight: 28,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 16,
    minHeight: 80,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { flex: 1, gap: 4 },
  tipTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: 15,
    color: '#111827',
    letterSpacing: -0.375,
    lineHeight: 22.5,
  },
  tipDesc: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: '#4B5563',
    letterSpacing: -0.3,
    lineHeight: 20,
  },
});
