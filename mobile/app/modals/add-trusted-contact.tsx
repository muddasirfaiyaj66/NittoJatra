import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export default function AddTrustedContactModal() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Add Trusted Contact</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput accessibilityLabel="Contact name" placeholder="Full name" placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} style={styles.input} />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput accessibilityLabel="Phone number" placeholder="01XXXXXXXXX" placeholderTextColor={Colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
          <GradientButton title="Save Contact" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  form: { padding: Spacing.xl, gap: Spacing.md },
  label: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  input: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.lg, paddingHorizontal: Spacing.base, height: 52 },
});
