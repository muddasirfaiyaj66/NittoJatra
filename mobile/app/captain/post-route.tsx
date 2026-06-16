import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { recentPlacesService } from '@/services/recent-places.service';
import { useDriverStore } from '@/store/driver.store';

type Step = 1 | 2 | 3 | 4;

export default function PostRouteWizard() {
  const [step, setStep] = useState<Step>(1);
  const [start, setStart] = useState('');
  const [dest, setDest] = useState('');
  const [days, setDays] = useState([1, 2, 3, 4, 5]);
  const [time, setTime] = useState('08:00 AM');
  const [price, setPrice] = useState('120');
  const [seats, setSeats] = useState(4);
  const [ac, setAc] = useState(true);
  const [womenOnly, setWomenOnly] = useState(false);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const fetchDashboard = useDriverStore((state) => state.fetchDashboard);

  const next = () => {
    if (step < 4) {
      setStep((s) => (s + 1) as Step);
      return;
    }

    const fromLabel = start.trim() || 'Mirpur';
    const toLabel = dest.trim() || 'Motijheel';
    void recentPlacesService.add(toLabel, 'Captain route');
    void fetchDashboard();
    Alert.alert('Route Saved', `${fromLabel} → ${toLabel} is ready on today's schedule hub.`, [
      { text: 'View Schedule', onPress: () => router.replace('/captain/(tabs)/schedule') },
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top', 'bottom']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => (step > 1 ? setStep((s) => (s - 1) as Step) : router.back())} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <View style={styles.progressRow}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.progressSeg, i <= step && styles.progressActive]} />
            ))}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {step === 1 && (
            <>
              <Text style={styles.h2}>Define Your <Text style={styles.accent}>Journey</Text></Text>
              <Text style={styles.sub}>Set your route stops and destination</Text>
              <Text style={styles.fieldLabel}>STARTING POINT</Text>
              <TextInput accessibilityLabel="Starting point" placeholder="Enter pickup location" value={start} onChangeText={setStart} style={styles.input} />
              <Pressable accessibilityRole="button" accessibilityLabel="Add stop" style={styles.addStop}>
                <Text style={styles.addStopText}>+ Add Stop</Text>
              </Pressable>
              <Text style={styles.fieldLabel}>DESTINATION</Text>
              <TextInput accessibilityLabel="Destination" placeholder="Enter destination" value={dest} onChangeText={setDest} style={styles.input} />
            </>
          )}
          {step === 2 && (
            <>
              <Text style={styles.h2}>Set Your <Text style={styles.accent}>Schedule</Text></Text>
              <Text style={styles.sub}>Choose active days and departure time</Text>
              <Text style={styles.fieldLabel}>ACTIVE DAY</Text>
              <View style={styles.dayRow}>
                {dayLabels.map((d, i) => (
                  <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Day ${d}`} onPress={() => setDays((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])} style={[styles.dayPill, days.includes(i) && styles.dayActive]}>
                    <Text style={[styles.dayText, days.includes(i) && styles.dayTextActive]}>{d}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.fieldLabel}>DEPARTURE TIME</Text>
              <TextInput accessibilityLabel="Departure time" value={time} onChangeText={setTime} style={styles.input} />
            </>
          )}
          {step === 3 && (
            <>
              <Text style={styles.h2}>Fair <Text style={styles.accent}>Pricing</Text></Text>
              <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>PRICE PER SEAT</Text>
                <TextInput accessibilityLabel="Price per seat" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.priceInput} />
                <Text style={styles.recommended}>Recommended: ৳120 – ৳150</Text>
              </View>
              <Text style={styles.fieldLabel}>TOTAL SEAT</Text>
              <View style={styles.seatRow}>
                {[1, 2, 3, 4].map((n) => (
                  <Pressable key={n} accessibilityRole="button" accessibilityLabel={`${n} seats`} onPress={() => setSeats(n)} style={[styles.seatBtn, seats === n && styles.seatActive]}>
                    <Text style={[styles.seatText, seats === n && styles.seatTextActive]}>{n}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
          {step === 4 && (
            <>
              <Text style={styles.h2}>Final <Text style={styles.accent}>Details</Text></Text>
              <View style={styles.amenityRow}>
                <Text style={styles.amenityLabel}>AC</Text>
                <Switch accessibilityLabel="Air conditioning" value={ac} onValueChange={setAc} trackColor={{ true: Colors.primary }} />
              </View>
              {['FREE WIFI', 'MUSIC', 'OTHER'].map((a) => (
                <View key={a} style={styles.amenityRow}>
                  <Text style={styles.amenityLabel}>{a}</Text>
                  <Switch accessibilityLabel={a} value={false} trackColor={{ true: Colors.primary }} />
                </View>
              ))}
              <View style={styles.amenityRow}>
                <Text style={styles.amenityLabel}>Women Only / RESTRICTED VISIBILITY</Text>
                <Switch accessibilityLabel="Women only" value={womenOnly} onValueChange={setWomenOnly} trackColor={{ true: Colors.primary }} />
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton title={step === 4 ? 'PUBLISH ROUTE ›' : 'CONTINUE ›'} onPress={next} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, gap: Spacing.md },
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  progressRow: { flex: 1, flexDirection: 'row', gap: 4 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.borderMid },
  progressActive: { backgroundColor: Colors.primary },
  content: { padding: Spacing.xl, paddingBottom: 100 },
  h2: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  accent: { color: Colors.primaryAlt },
  sub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.xl },
  fieldLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.md },
  input: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.lg, paddingHorizontal: Spacing.base, height: 52 },
  addStop: { paddingVertical: Spacing.md },
  addStopText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  dayRow: { flexDirection: 'row', gap: Spacing.sm },
  dayPill: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: Colors.borderMid, alignItems: 'center', justifyContent: 'center' },
  dayActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  dayTextActive: { color: Colors.white },
  priceCard: { backgroundColor: '#ECFDF5', borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.md },
  priceLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald, letterSpacing: 1 },
  priceInput: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary, marginVertical: Spacing.xs },
  recommended: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  seatRow: { flexDirection: 'row', gap: Spacing.md },
  seatBtn: { width: 56, height: 56, borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.borderMid, alignItems: 'center', justifyContent: 'center' },
  seatActive: { borderColor: Colors.primary, backgroundColor: Colors.surfaceIndigo },
  seatText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textSecondary },
  seatTextActive: { color: Colors.primary },
  amenityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  amenityLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary, flex: 1 },
  footer: { padding: Spacing.xl, borderTopWidth: 1, borderTopColor: Colors.border },
});
