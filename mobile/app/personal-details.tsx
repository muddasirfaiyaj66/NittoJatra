import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function PersonalDetailsScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Personal Details</Text>
          <View style={styles.back} />
        </View>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.form}>
        {[
          { label: 'Full Name', value: user?.name ?? 'Ahmed Rahman' },
          { label: 'Email', value: user?.email ?? 'rider@example.com' },
          { label: 'Phone', value: user?.phone ?? '+8801712345678' },
        ].map((f) => (
          <View key={f.label}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput accessibilityLabel={f.label} defaultValue={f.value} style={styles.input} />
          </View>
        ))}
        <GradientButton title="SAVE CHANGES" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  form: { padding: Spacing.xl, gap: Spacing.md },
  label: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  input: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.lg, paddingHorizontal: Spacing.base, height: 52 },
});
