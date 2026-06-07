import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { SAVED_PLACES } from '@/constants/mock-data';

export default function SavedPlacesModal() {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Saved Places</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.list}>
          {SAVED_PLACES.map((p) => (
            <View key={p.id} style={styles.row}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <View style={styles.rowText}>
                <Text style={styles.label}>{p.label}</Text>
                <Text style={styles.address}>{p.address}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${p.label}`}>
                <Text style={styles.edit}>Edit</Text>
              </Pressable>
            </View>
          ))}
          <Pressable accessibilityRole="button" accessibilityLabel="Add new place" style={styles.addBtn}>
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={styles.addText}>Add New</Text>
          </Pressable>
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
  list: { padding: Spacing.xl, gap: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowText: { flex: 1 },
  label: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  address: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  edit: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.base, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.borderMid, borderRadius: Radius.lg },
  addText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.primary },
});
