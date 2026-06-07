import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/components/shared/Toast';
import { getOperatorById, MOCK_SEARCH_RESULTS } from '@/constants/mock-data';
import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { haptics } from '@/hooks/useHaptics';
import { bookingService } from '@/services/booking.service';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';
import { Booking, PaymentMethod } from '@/types';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { id: 'bkash', label: 'bKash', icon: 'phone-portrait-outline', color: '#E2136E' },
  { id: 'nagad', label: 'Nagad', icon: 'wallet-outline', color: '#F6921E' },
  { id: 'rocket', label: 'Rocket', icon: 'rocket-outline', color: '#8C3494' },
  { id: 'card', label: 'Card', icon: 'card-outline', color: '#4F46E5' },
  { id: 'cash', label: 'Cash on Counter', icon: 'cash-outline', color: '#10B981' },
];

const PROMO_CODE = 'NITTO10';
const PROMO_DISCOUNT = 10;

export default function ConfirmScreen() {
  const params = useLocalSearchParams<{
    rideId: string;
    seats: string;
    total: string;
    subtotal: string;
    fee: string;
  }>();
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const toast = useToast();

  const result = useMemo(
    () => MOCK_SEARCH_RESULTS.find((r) => r.id === params.rideId) ?? MOCK_SEARCH_RESULTS[0],
    [params.rideId],
  );
  const operator = getOperatorById(result.operatorId);
  const seats = useMemo(() => (params.seats ? params.seats.split(',') : []), [params.seats]);

  const subtotal = Number(params.subtotal ?? 0);
  const fee = Number(params.fee ?? 0);

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [nid, setNid] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('bkash');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);

  const discount = promoApplied ? PROMO_DISCOUNT : 0;
  const total = Math.max(0, subtotal + fee - discount);

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      setError(null);
      toast.show('Promo code applied!', 'success');
    } else {
      setError('Invalid promo code. Try NITTO10');
      toast.show('Invalid promo code', 'error');
    }
  };

  const handleConfirm = async () => {
    setError(null);
    if (!name || !phone || !email) {
      setError('Please complete passenger details.');
      return;
    }
    if (!agreed) {
      setError('Please accept the terms to continue.');
      return;
    }
    setSubmitting(true);
    try {
      const booking = await bookingService.createBooking({
        route: { from: result.from, to: result.to },
        date: new Date().toISOString().slice(0, 10),
        departureTime: result.departure,
        arrivalTime: result.arrival,
        seats,
        operator: operator?.name ?? 'NittoJatra',
        amount: total,
      });
      addBooking(booking);
      haptics.success();
      setSuccess(booking);
    } catch {
      setError('Something went wrong. Please try again.');
      toast.show('Booking failed. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.navBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.navTitle}>Confirm Booking</Text>
          <View style={styles.iconBtn} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Passenger details */}
            <Text style={styles.sectionTitle}>Passenger Details</Text>
            <View style={styles.card}>
              <Input label="Full Name" value={name} onChangeText={setName} autoCapitalize="words" />
              <View style={styles.gap} />
              <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <View style={styles.gap} />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.gap} />
              <Input
                label="NID (optional)"
                value={nid}
                onChangeText={setNid}
                keyboardType="number-pad"
                placeholder="National ID number"
              />
            </View>

            {/* Journey summary */}
            <Text style={styles.sectionTitle}>Journey Summary</Text>
            <View style={styles.card}>
              <View style={styles.summaryHead}>
                <Text style={styles.operatorName}>{operator?.name}</Text>
                <Text style={styles.badgeType}>{result.type}</Text>
              </View>
              <View style={styles.routeRow}>
                <Text style={styles.routeText}>{result.from}</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
                <Text style={styles.routeText}>{result.to}</Text>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>
                    {result.departure} - {result.arrival}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="ticket-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>Seats {seats.join(', ')}</Text>
                </View>
              </View>
            </View>

            {/* Fare breakdown */}
            <Text style={styles.sectionTitle}>Fare Breakdown</Text>
            <View style={styles.card}>
              <Row label={`Base fare (${seats.length} seats)`} value={`৳ ${subtotal}`} />
              <Row label="Convenience fee" value={`৳ ${fee}`} />
              {discount > 0 ? <Row label="Discount" value={`- ৳ ${discount}`} positive /> : null}
              <View style={styles.divider} />
              <Row label="Total" value={`৳ ${total}`} bold />
            </View>

            {/* Promo */}
            <Text style={styles.sectionTitle}>Promo Code</Text>
            <View style={styles.promoRow}>
              <Input
                value={promo}
                onChangeText={setPromo}
                placeholder="Enter promo code"
                autoCapitalize="characters"
                editable={!promoApplied}
                containerStyle={styles.promoInput}
              />
              <Button
                title={promoApplied ? 'Applied' : 'Apply'}
                variant={promoApplied ? 'secondary' : 'outline'}
                fullWidth={false}
                onPress={applyPromo}
                disabled={promoApplied}
                style={styles.promoBtn}
              />
            </View>

            {/* Payment */}
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.card}>
              {PAYMENT_METHODS.map((method, i) => {
                const active = payment === method.id;
                return (
                  <Pressable
                    key={method.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={method.label}
                    onPress={() => setPayment(method.id)}
                    style={[styles.paymentRow, i < PAYMENT_METHODS.length - 1 && styles.paymentBorder]}
                  >
                    <View style={[styles.paymentIcon, { backgroundColor: `${method.color}1A` }]}>
                      <Ionicons name={method.icon} size={20} color={method.color} />
                    </View>
                    <Text style={styles.paymentLabel}>{method.label}</Text>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? <View style={styles.radioDot} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Terms */}
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreed }}
              accessibilityLabel="Accept terms and conditions"
              onPress={() => setAgreed((a) => !a)}
              style={styles.termsRow}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
              </View>
              <Text style={styles.termsText}>
                I agree to the booking <Text style={styles.termsLink}>Terms &amp; Conditions</Text>
              </Text>
            </Pressable>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Sticky pay bar */}
      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <View style={styles.bottomContent}>
          <Button
            title={`CONFIRM & PAY ৳${total}`}
            size="lg"
            loading={submitting}
            onPress={handleConfirm}
          />
        </View>
      </SafeAreaView>

      {/* Success modal */}
      <Modal visible={!!success} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={48} color={colors.white} />
            </View>
            <Text style={styles.modalTitle}>Booking Confirmed!</Text>
            <Text style={styles.modalSubtitle}>Your seats are reserved. Have a safe journey.</Text>
            <View style={styles.bookingIdBox}>
              <Text style={styles.bookingIdLabel}>Booking ID</Text>
              <Text style={styles.bookingId}>{success?.id}</Text>
            </View>
            <Button
              title="View Bookings"
              size="lg"
              style={styles.modalBtn}
              onPress={() => {
                setSuccess(null);
                router.dismissAll();
                router.replace('/(tabs)/bookings');
              }}
            />
            <Button
              title="Download Ticket"
              variant="outline"
              size="lg"
              style={styles.modalBtn}
              onPress={() => {
                setSuccess(null);
                router.dismissAll();
                router.replace('/(tabs)');
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
  positive,
}: {
  label: string;
  value: string;
  bold?: boolean;
  positive?: boolean;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.fareRow}>
      <Text style={[styles.fareLabel, bold && styles.fareBold]}>{label}</Text>
      <Text
        style={[
          styles.fareValue,
          bold && styles.fareBoldValue,
          positive && styles.farePositive,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  flex: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  navTitle: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.md,
    color: colors.textPrimary,
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.md,
    color: colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Spacing.base,
    ...Shadows.card,
  },
  gap: { height: Spacing.md },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  operatorName: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: colors.textPrimary,
  },
  badgeType: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.xs,
    color: colors.primary,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  routeText: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.base,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  fareLabel: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: colors.textSecondary,
  },
  fareValue: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.base,
    color: colors.textPrimary,
  },
  fareBold: { fontFamily: Typography.fonts.bold, color: colors.textPrimary },
  fareBoldValue: {
    fontFamily: Typography.fonts.extrabold,
    fontSize: Typography.fontSizes.lg,
    color: colors.primary,
  },
  farePositive: { color: colors.success },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderMid,
    marginVertical: Spacing.sm,
  },
  promoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  promoInput: { flex: 1 },
  promoBtn: { minWidth: 96, marginTop: 0 },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  paymentBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentLabel: {
    flex: 1,
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.base,
    color: colors.textPrimary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderMid,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  termsText: {
    flex: 1,
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  termsLink: { color: colors.primary, fontFamily: Typography.fonts.semibold },
  error: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: colors.danger,
    marginTop: Spacing.base,
  },
  bottomBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Shadows.float,
  },
  bottomContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontFamily: Typography.fonts.extrabold,
    fontSize: Typography.fontSizes.xl,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  bookingIdBox: {
    backgroundColor: colors.accentLight,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  bookingIdLabel: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.xs,
    color: colors.textMuted,
  },
  bookingId: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.md,
    color: colors.primary,
    marginTop: 2,
  },
  modalBtn: { marginTop: Spacing.md },
});
