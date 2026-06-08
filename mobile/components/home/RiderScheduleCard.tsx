import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Typography } from '@/constants/theme';
import { RiderUpcomingRide } from '@/types';

const DRIVER_KARIM = require('../../assets/figma/driver-karim.png');
const DRIVER_AVATAR = require('../../assets/figma/avatar-driver.png');

interface RiderScheduleCardProps {
  ride: RiderUpcomingRide;
  onTrackLive: () => void;
}

export function RiderScheduleCard({ ride, onTrackLive }: RiderScheduleCardProps) {
  const avatar = ride.driverName === 'Rahim Mia' ? DRIVER_AVATAR : DRIVER_KARIM;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.driverRow}>
          <View style={styles.avatarWrap}>
            <Image source={avatar} style={styles.avatar} contentFit="cover" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{ride.driverName}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="star" size={12} color={Colors.gold} />
              <Text style={styles.rating}>{ride.rating}</Text>
              <Text style={styles.vehicle}>• {ride.vehicle}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.badge, ride.badgeTone === 'day' ? styles.badgeDay : styles.badgeTime]}>
          <Text style={[styles.badgeText, ride.badgeTone === 'day' && styles.badgeTextDay]}>{ride.badge}</Text>
        </View>
      </View>

      <View style={styles.routeBlock}>
        <View style={styles.routeLine} />
        <View style={styles.routeDotStart} />
        <View style={styles.routeDotEnd} />
        <View style={styles.routeText}>
          <Text style={styles.routePoint}>{ride.from}</Text>
          <Text style={styles.routeTo}>to</Text>
          <Text style={styles.routePoint}>{ride.to}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.etaPill}>
          <Text style={styles.etaText}>{ride.eta}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Track live" onPress={onTrackLive}>
          <Text style={styles.trackText}>TRACK LIVE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 21,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  driverRow: { flexDirection: 'row', gap: 12, flex: 1 },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  avatar: { width: '100%', height: '100%' },
  driverInfo: { flex: 1 },
  driverName: {
    fontFamily: Typography.fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.375,
    lineHeight: 22.5,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: '#334155',
    letterSpacing: Typography.letterSpacing.stat,
  },
  vehicle: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    letterSpacing: Typography.letterSpacing.stat,
  },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  badgeTime: { backgroundColor: '#D1FAE5' },
  badgeDay: { backgroundColor: 'transparent' },
  badgeText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: '#047857',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  badgeTextDay: { color: Colors.textPrimary },
  routeBlock: { paddingLeft: 16, minHeight: 72, justifyContent: 'center' },
  routeLine: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 2,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radius.full,
  },
  routeDotStart: {
    position: 'absolute',
    left: -2.5,
    top: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryGradStart,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  routeDotEnd: {
    position: 'absolute',
    left: -2.5,
    bottom: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.purple500,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  routeText: { gap: 4 },
  routePoint: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 20,
  },
  routeTo: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.stat,
    paddingLeft: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.8,
    borderTopColor: Colors.border,
    paddingTop: 13,
  },
  etaPill: {
    backgroundColor: '#ECFDF5',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  etaText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: '#059669',
    letterSpacing: Typography.letterSpacing.stat,
  },
  trackText: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
