import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

const SECURITY_ITEMS = [
  { icon: 'key-outline', title: 'Change Password', sub: 'Last changed 30 days ago' },
  { icon: 'finger-print-outline', title: 'Two-Factor Authentication', sub: 'Add extra security', toggle: true },
  { icon: 'lock-closed-outline', title: 'Security PIN', sub: 'Used for payments', route: '/modals/security-pin' },
  { icon: 'document-text-outline', title: 'Security Logs', sub: 'View recent login activity' },
];

export default function AccountSecurityScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Account Security</Text>
          <View style={styles.back} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>SECURITY</Text>
        <View style={[styles.card, Shadows.card]}>
          {SECURITY_ITEMS.map((item, i) => (
            <Pressable
              key={item.title}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => item.route && router.push(item.route as '/modals/security-pin')}
              style={[styles.row, i < SECURITY_ITEMS.length - 1 && styles.rowBorder]}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSub}>{item.sub}</Text>
              </View>
              {item.toggle ? (
                <Switch value trackColor={{ true: Colors.primary, false: Colors.borderMid }} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary, letterSpacing: Typography.letterSpacing.heading },
  scroll: { padding: Spacing.xl, paddingBottom: 40 },
  sectionLabel: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.textMuted, letterSpacing: Typography.letterSpacing.subtitle, textTransform: 'uppercase', marginBottom: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.base },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconWrap: { width: 48, height: 48, borderRadius: Radius.lg, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontFamily: Typography.fonts.bold, fontSize: 15, color: Colors.textPrimary, letterSpacing: -0.375 },
  rowSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: Typography.letterSpacing.stat },
});
