import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '@/services/booking.service';
import { GradientButton } from '@/components/ui';
import { messageService } from '@/services/message.service';
import { Colors, formatTaka, Radius, Spacing, Typography } from '@/constants/theme';
import { chatRoute } from '@/constants/routes';
import { useDriverStore } from '@/store/driver.store';

export default function ManagementConsoleModal() {
  const schedule = useDriverStore((s) => s.schedules[0]);
  const riders = useDriverStore((s) => s.riders);
  const [openingChatId, setOpeningChatId] = useState<string | null>(null);
  const [reportingRiderId, setReportingRiderId] = useState<string | null>(null);
  const [complaintCategory, setComplaintCategory] = useState('behavior');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [reportedBookings, setReportedBookings] = useState<Record<string, boolean>>({});

  const handleDriverSubmitComplaint = async (bookingId: string, againstUserId?: string) => {
    if (!againstUserId) {
      Alert.alert('Error', 'Cannot resolve passenger user ID.');
      return;
    }
    if (!complaintDescription.trim()) {
      Alert.alert('Validation Error', 'Please describe the passenger issue.');
      return;
    }
    setSubmittingComplaint(true);
    try {
      await bookingService.submitComplaint({
        bookingId,
        againstUserId,
        byRole: 'driver',
        category: complaintCategory,
        description: complaintDescription,
      });
      setReportedBookings((prev) => ({ ...prev, [bookingId]: true }));
      Alert.alert('Report Registered', 'Your report has been successfully submitted. We will review it.');
      setReportingRiderId(null);
      setComplaintDescription('');
    } catch (e: any) {
      console.error('Driver report error:', e);
      Alert.alert('Error', e.message || 'Failed to file report. Please try again.');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const openChat = async (bookingRef: string, riderName: string) => {
    if (openingChatId) return;
    setOpeningChatId(bookingRef);
    try {
      const thread = await messageService.ensureFromBooking(bookingRef);
      router.push(chatRoute(thread.id, riderName || thread.name));
    } finally {
      setOpeningChatId(null);
    }
  };

  if (!schedule) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.handle} />
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
          <View style={styles.content}>
            <Text style={styles.routeTitle}>No active schedule</Text>
            <Text style={styles.meta}>Today&apos;s rides will appear here from the API.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </Pressable>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.routeTitle}>{schedule.name}</Text>
          <Text style={styles.meta}>DEPARTURE: {schedule.time} • SUBSCRIBERS {schedule.seatsFilled}/{schedule.totalSeats}</Text>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CONNECTED RIDERS</Text>
            <Text style={styles.booked}>{riders.length} Booked</Text>
          </View>
          {riders.length === 0 ? (
            <Text style={styles.emptyText}>No passengers booked on today&apos;s rides yet.</Text>
          ) : (
            riders.map((r) => (
              <View key={r.id} style={styles.riderContainer}>
                <View style={styles.riderRow}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>{r.initial}</Text></View>
                  <View style={styles.riderInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.riderName}>{r.name}</Text>
                      {r.verified && <Text style={styles.verified}>VERIFIED</Text>}
                    </View>
                    <Text style={styles.plan}>{r.plan} • {formatTaka(r.amount)}</Text>
                  </View>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Call ${r.name}`}><Ionicons name="call-outline" size={18} color={Colors.primary} /></Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Chat ${r.name}`}
                    onPress={() => void openChat(r.id, r.name)}
                  >
                    <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Report passenger ${r.name}`}
                    onPress={() => {
                      if (reportedBookings[r.id]) return;
                      setReportingRiderId(reportingRiderId === r.id ? null : r.id);
                      setComplaintCategory('behavior');
                      setComplaintDescription('');
                    }}
                  >
                    <Ionicons
                      name={reportedBookings[r.id] ? "alert-circle" : "alert-circle-outline"}
                      size={18}
                      color={reportedBookings[r.id] ? Colors.danger : Colors.textMuted}
                    />
                  </Pressable>
                </View>

                {reportingRiderId === r.id && (
                  <View style={styles.reportFormInline}>
                    <Text style={styles.inlineFormTitle}>Report Passenger</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollInline}>
                      {[
                        { label: 'Rude Behavior', value: 'behavior' },
                        { label: 'Late Arrival', value: 'delay' },
                        { label: 'No Payment', value: 'payment' },
                        { label: 'Car Damage', value: 'safety' },
                        { label: 'Other Issue', value: 'other' },
                      ].map((cat) => (
                        <Pressable
                          key={cat.value}
                          onPress={() => setComplaintCategory(cat.value)}
                          style={[
                            styles.inlineCatChip,
                            complaintCategory === cat.value && styles.activeInlineCatChip,
                          ]}
                        >
                          <Text style={[styles.inlineCatChipLabel, complaintCategory === cat.value && styles.activeInlineCatChipLabel]}>
                            {cat.label}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                    <TextInput
                      style={styles.inlineInput}
                      placeholder="Describe passenger issue..."
                      placeholderTextColor={Colors.textMuted}
                      value={complaintDescription}
                      onChangeText={setComplaintDescription}
                      multiline
                    />
                    <View style={styles.inlineActionRow}>
                      <Pressable
                        style={styles.inlineCancelBtn}
                        onPress={() => setReportingRiderId(null)}
                      >
                        <Text style={styles.inlineCancelText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.inlineSubmitBtn, submittingComplaint && { opacity: 0.7 }]}
                        onPress={() => void handleDriverSubmitComplaint(r.bookingDbId || r.id, r.passengerUserId)}
                        disabled={submittingComplaint}
                      >
                        {submittingComplaint ? (
                          <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                          <Text style={styles.inlineSubmitText}>Submit</Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
          <GradientButton title="INITIATE JOURNEY" onPress={() => router.back()} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  close: { alignSelf: 'flex-end', paddingHorizontal: Spacing.xl },
  content: { padding: Spacing.xl, gap: Spacing.md },
  routeTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  meta: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  sectionTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  booked: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.primary },
  riderInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  riderName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  verified: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald },
  plan: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  riderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reportFormInline: {
    backgroundColor: '#FFF5F5',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  inlineFormTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.danger,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryScrollInline: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  inlineCatChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderMid,
    backgroundColor: '#F8FAFC',
    marginRight: 6,
  },
  activeInlineCatChip: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  inlineCatChipLabel: {
    fontFamily: Typography.fonts.semibold,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  activeInlineCatChipLabel: {
    color: Colors.white,
  },
  inlineInput: {
    borderWidth: 1,
    borderColor: Colors.borderMid,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    minHeight: 50,
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    textAlignVertical: 'top',
  },
  inlineActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  inlineCancelBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderMid,
  },
  inlineCancelText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
  },
  inlineSubmitBtn: {
    backgroundColor: Colors.danger,
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineSubmitText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
  },
});
