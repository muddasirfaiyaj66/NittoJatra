import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { SAVED_PLACES } from '@/constants/mock-data';
import { SavedPlace } from '@/types';
import { GradientButton } from '@/components/ui';

const getIconForType = (type: 'home' | 'office' | 'other') => {
  switch (type) {
    case 'home':
      return 'home';
    case 'office':
      return 'briefcase';
    default:
      return 'location';
  }
};

export default function SavedPlacesModal() {
  const [places, setPlaces] = useState<SavedPlace[]>(SAVED_PLACES);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'home' | 'office' | 'other'>('other');

  const handleStartAdd = () => {
    setEditingId(null);
    setLabel('');
    setAddress('');
    setType('other');
    setIsEditing(true);
  };

  const handleStartEdit = (p: SavedPlace) => {
    setEditingId(p.id);
    setLabel(p.label);
    setAddress(p.address);
    setType(p.type);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!label.trim()) {
      Alert.alert('Error', 'Please enter a label for this place.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter the address.');
      return;
    }

    let updated: SavedPlace[];
    if (editingId) {
      updated = places.map((p) =>
        p.id === editingId ? { ...p, label: label.trim(), address: address.trim(), type } : p
      );
    } else {
      updated = [
        ...places,
        {
          id: `sp-${Date.now()}`,
          label: label.trim(),
          address: address.trim(),
          type,
        },
      ];
    }

    setPlaces(updated);
    // Persist to mock data in-memory array so that it retains during runtime
    SAVED_PLACES.length = 0;
    SAVED_PLACES.push(...updated);

    setIsEditing(false);
    setEditingId(null);
    setLabel('');
    setAddress('');
    setType('other');
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete Saved Place',
      'Are you sure you want to delete this saved place?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(id),
        },
      ]
    );
  };

  const handleDelete = (id: string) => {
    const updated = places.filter((p) => p.id !== id);
    setPlaces(updated);
    SAVED_PLACES.length = 0;
    SAVED_PLACES.push(...updated);

    setIsEditing(false);
    setEditingId(null);
    setLabel('');
    setAddress('');
    setType('other');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            {isEditing && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to list"
                onPress={() => setIsEditing(false)}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
              </Pressable>
            )}
            <Text style={styles.title}>
              {isEditing ? (editingId ? 'Edit Place' : 'Add New Place') : 'Saved Places'}
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>

        {isEditing ? (
          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Place Label</Text>
            <TextInput
              accessibilityLabel="Place label input"
              placeholder="e.g. Home, Office, Gym, Cafe"
              placeholderTextColor={Colors.textMuted}
              value={label}
              onChangeText={setLabel}
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Address</Text>
            <TextInput
              accessibilityLabel="Place address input"
              placeholder="e.g. House 12, Road 27, Dhanmondi"
              placeholderTextColor={Colors.textMuted}
              value={address}
              onChangeText={setAddress}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.fieldLabel}>Category Type</Text>
            <View style={styles.typeSelector}>
              {(['home', 'office', 'other'] as const).map((t) => {
                const icon = getIconForType(t);
                const isSelected = type === t;
                return (
                  <Pressable
                    key={t}
                    accessibilityRole="button"
                    accessibilityLabel={`Select category ${t}`}
                    style={[
                      styles.typePill,
                      isSelected && styles.typePillSelected,
                    ]}
                    onPress={() => setType(t)}
                  >
                    <Ionicons
                      name={isSelected ? (icon as any) : (`${icon}-outline` as any)}
                      size={18}
                      color={isSelected ? Colors.white : Colors.textSecondary}
                    />
                    <Text style={[styles.typeText, isSelected && styles.typeTextSelected]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actionButtons}>
              <GradientButton
                title={editingId ? 'Update Place' : 'Save Place'}
                onPress={handleSave}
                style={styles.saveBtn}
              />
              {editingId && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Delete saved place"
                  onPress={() => confirmDelete(editingId)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash" size={20} color={Colors.danger} />
                  <Text style={styles.deleteBtnText}>Delete Place</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {places.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No saved places yet.</Text>
                <Text style={styles.emptySubtext}>Add your frequent destinations to book rides faster.</Text>
              </View>
            ) : (
              places.map((p) => (
                <View key={p.id} style={styles.row}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={getIconForType(p.type) as any} size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={styles.label}>{p.label}</Text>
                    <Text style={styles.address}>{p.address}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${p.label}`}
                    onPress={() => handleStartEdit(p)}
                    style={styles.editBtnInline}
                  >
                    <Ionicons name="create-outline" size={20} color={Colors.primary} />
                  </Pressable>
                </View>
              ))
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add new place"
              onPress={handleStartAdd}
              style={styles.addBtn}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
              <Text style={styles.addText}>Add New Destination</Text>
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  backBtn: { padding: 4 },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  list: { padding: Spacing.xl, gap: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  label: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  address: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  editBtnInline: { padding: Spacing.sm },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.base, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.borderMid, borderRadius: Radius.lg, marginTop: Spacing.md },
  addText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.primary },
  
  // Form styles
  formContainer: { padding: Spacing.xl, gap: Spacing.sm },
  fieldLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginBottom: 6, marginTop: Spacing.sm },
  input: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.lg, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, minHeight: 52, backgroundColor: '#F9FAFB' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  typeSelector: { flexDirection: 'row', gap: Spacing.md, marginVertical: Spacing.sm },
  typePill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.md, backgroundColor: Colors.surface },
  typePillSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  typeTextSelected: { color: Colors.white },
  
  actionButtons: { gap: Spacing.md, marginTop: Spacing.lg },
  saveBtn: { flex: 1 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, height: 56, borderWidth: 1, borderColor: '#FECACA', borderRadius: Radius.lg, backgroundColor: '#FEF2F2' },
  deleteBtnText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.danger },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxl, gap: Spacing.sm },
  emptyText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.md, color: Colors.textPrimary },
  emptySubtext: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.lg },
});
