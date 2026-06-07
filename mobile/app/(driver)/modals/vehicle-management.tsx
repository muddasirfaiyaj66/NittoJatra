import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export default function VehicleManagementModal() {
  const [model, setModel] = useState('Toyota Axio 2018');
  const [plate, setPlate] = useState('Dhaka Metro-GA-11-2233');

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.content}>
          <Text style={styles.label}>VEHICLE MODEL</Text>
          <TextInput accessibilityLabel="Vehicle model" value={model} onChangeText={setModel} style={styles.input} />
          <Text style={styles.label}>LICENSE PLATE</Text>
          <TextInput accessibilityLabel="License plate" value={plate} onChangeText={setPlate} style={styles.input} />
          <Pressable accessibilityRole="button" accessibilityLabel="Upload license photo" style={styles.upload}>
            <Ionicons name="camera-outline" size={24} color={Colors.textMuted} />
            <Text style={styles.uploadText}>LICENSE PHOTO</Text>
          </Pressable>
          <GradientButton title="SAVE VEHICLE INFO" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  close: { alignSelf: 'flex-end', paddingHorizontal: Spacing.xl },
  content: { padding: Spacing.xl, gap: Spacing.md },
  label: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  input: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.lg, paddingHorizontal: Spacing.base, height: 52 },
  upload: { alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.borderMid, borderRadius: Radius.lg, gap: Spacing.sm },
  uploadText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textMuted },
});
