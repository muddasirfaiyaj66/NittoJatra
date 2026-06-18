import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function VehicleManagementModal() {
  const { user, updateUser } = useAuth();
  const [model, setModel] = useState(user?.vehicle ?? '');
  const [plate, setPlate] = useState(user?.vehiclePlate ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedModel = model.trim();
    const trimmedPlate = plate.trim();

    if (!trimmedModel) {
      Alert.alert('Missing info', 'Please enter your vehicle model.');
      return;
    }
    if (!trimmedPlate) {
      Alert.alert('Missing info', 'Please enter your license plate.');
      return;
    }

    setSaving(true);
    try {
      await updateUser({
        vehicle: trimmedModel,
        vehiclePlate: trimmedPlate,
      });
      router.back();
    } catch (e) {
      Alert.alert('Save failed', (e as Error).message || 'Could not save vehicle info.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.content}>
          <Text style={styles.label}>VEHICLE MODEL</Text>
          <TextInput
            accessibilityLabel="Vehicle model"
            value={model}
            onChangeText={setModel}
            placeholder="e.g. Toyota Axio 2018"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
          />
          <Text style={styles.label}>LICENSE PLATE</Text>
          <TextInput
            accessibilityLabel="License plate"
            value={plate}
            onChangeText={setPlate}
            placeholder="e.g. Dhaka Metro-GA-11-2233"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="characters"
            style={styles.input}
          />
          <Pressable accessibilityRole="button" accessibilityLabel="Upload license photo" style={styles.upload}>
            <Ionicons name="camera-outline" size={24} color={Colors.textMuted} />
            <Text style={styles.uploadText}>LICENSE PHOTO</Text>
          </Pressable>
          <GradientButton title="SAVE VEHICLE INFO" onPress={handleSave} loading={saving} />
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
