import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

const TAGS = [
  'Great Driver', 'Safe Driving', 'On Time', 'Friendly',
  'Clean Vehicle', 'Smooth Ride', 'Professional',
];

export default function RateDriverModal() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const submit = () => {
    if (rating === 0) {
      Alert.alert('Please select a rating', 'Tap the stars to rate your driver.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => router.back(), 1800);
  };

  if (submitted) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.thankYou}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={72} color={Colors.accentEmerald} />
          </View>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successSub}>
            Your {rating}-star rating has been submitted for Karim.
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn} accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Rate Your Driver</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Driver Card */}
        <View style={[styles.driverCard, Shadows.card]}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person" size={32} color={Colors.primary} />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Karim Ahmed</Text>
            <Text style={styles.driverSub}>Shahbag → Motijheel · Today</Text>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your ride?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= (hovered || rating);
              return (
                <Pressable
                  key={star}
                  accessibilityLabel={`${star} star`}
                  accessibilityRole="button"
                  onPressIn={() => setHovered(star)}
                  onPressOut={() => setHovered(0)}
                  onPress={() => setRating(star)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={filled ? 'star' : 'star-outline'}
                    size={48}
                    color={filled ? Colors.gold : Colors.track}
                  />
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.ratingLabel}>
            {rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
          </Text>
        </View>

        {/* Quick Tags */}
        {rating >= 4 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What stood out?</Text>
            <View style={styles.tagsWrap}>
              {TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    accessibilityRole="button"
                    accessibilityLabel={tag}
                    onPress={() => toggleTag(tag)}
                    style={[styles.tag, active && styles.tagActive]}
                  >
                    <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add a comment (optional)</Text>
          <TextInput
            accessibilityLabel="Comment"
            style={styles.commentInput}
            placeholder="Tell us more about your experience…"
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        {/* Submit */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Submit rating"
          onPress={submit}
          style={[styles.submitBtn, rating === 0 && styles.submitDisabled]}
        >
          <Ionicons name="star" size={18} color={Colors.white} />
          <Text style={styles.submitText}>Submit Rating</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
  },

  scroll: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 40 },

  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.xl,
  },
  driverAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.surfaceIndigo,
    alignItems: 'center', justifyContent: 'center',
  },
  driverInfo: { flex: 1 },
  driverName: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
  },
  driverSub: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  section: { gap: Spacing.md },
  sectionTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },

  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  ratingLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderMid,
    backgroundColor: Colors.surface,
  },
  tagActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceIndigo,
  },
  tagText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
  },
  tagTextActive: {
    color: Colors.primary,
    fontFamily: Typography.fonts.bold,
  },

  commentInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderMid,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    minHeight: 100,
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    marginTop: Spacing.sm,
  },
  submitDisabled: { opacity: 0.45 },
  submitText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.white,
    letterSpacing: 0.3,
  },

  thankYou: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  successIcon: { marginBottom: Spacing.md },
  successTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
  },
  successSub: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
});
