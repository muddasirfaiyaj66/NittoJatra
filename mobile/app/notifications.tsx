import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusDot } from '@/components/ui';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { buildNotificationsFromBookings } from '@/services/notification.service';
import { useBookingStore } from '@/store/booking.store';

const ICON_MAP = {
  success: { icon: 'checkmark-circle', color: '#ECFDF5', iconColor: Colors.accentEmerald },
  promo: { icon: 'pricetag', color: '#FDF4FF', iconColor: Colors.primaryAlt },
  warning: { icon: 'warning', color: '#FFFBEB', iconColor: Colors.warning },
  info: { icon: 'information-circle', color: Colors.surfaceIndigo, iconColor: Colors.primary },
} as const;

export default function NotificationsScreen() {
  const bookings = useBookingStore((s) => s.bookings);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const notifications = useMemo(
    () =>
      buildNotificationsFromBookings(bookings)
        .map((notification) => ({
          ...notification,
          unread: notification.unread && !readIds.includes(notification.id),
        }))
        .filter((notification) => !deletedIds.includes(notification.id)),
    [bookings, readIds, deletedIds],
  );

  const markAllRead = () => {
    setReadIds(notifications.map((notification) => notification.id));
  };

  const deleteNotification = (id: string) => {
    setDeletedIds((prev) => [...prev, id]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Notifications</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Mark all read" onPress={markAllRead} style={styles.markAll}>
            <Text style={styles.markAllText}>MARK ALL READ</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.list}>
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications yet.</Text>
        ) : (
          notifications.map((n) => {
            const cfg = ICON_MAP[n.type];
            return (
              <View key={n.id} style={[styles.card, Shadows.card]}>
                <View style={[styles.iconTile, { backgroundColor: cfg.color }]}>
                  <Ionicons name={cfg.icon as keyof typeof Ionicons.glyphMap} size={22} color={cfg.iconColor} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{n.title}</Text>
                    {n.unread && <StatusDot size={8} color={Colors.primary} />}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Delete notification"
                      onPress={() => deleteNotification(n.id)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
                    </Pressable>
                  </View>
                  <Text style={styles.cardBody}>{n.body}</Text>
                  <Text style={styles.cardTime}>{n.timeAgo}</Text>
                </View>
              </View>
            );
          })
        )}
        <Text style={styles.footer}>START OF TIMELINE</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  markAll: { backgroundColor: Colors.surfaceIndigo, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  markAllText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary, letterSpacing: 0.5 },
  list: { padding: Spacing.xl, gap: Spacing.sm, paddingBottom: 40 },
  card: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md },
  iconTile: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, flex: 1 },
  cardBody: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginTop: 4 },
  cardTime: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, marginTop: Spacing.xs },
  deleteBtn: { padding: Spacing.xs, marginLeft: Spacing.xs },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xl },
  footer: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, textAlign: 'center', letterSpacing: 1, marginTop: Spacing.xl },
});
