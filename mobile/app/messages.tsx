import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { StatusDot } from '@/components/ui';
import { useBookingStore } from '@/store/booking.store';

export default function MessagesScreen() {
  const [query, setQuery] = useState('');
  const bookings = useBookingStore((s) => s.bookings);

  const threads = useMemo(
    () =>
      bookings.slice(0, 10).map((booking) => ({
        id: booking.id,
        name: booking.operator,
        initial: booking.operator.charAt(0).toUpperCase(),
        time: booking.departureTime,
        lastMessage: `Your booking ${booking.route.from} → ${booking.route.to} is ${booking.status}.`,
        online: booking.status === 'upcoming' || booking.status === 'ongoing',
        unread: booking.status === 'upcoming' ? 1 : 0,
      })),
    [bookings],
  );

  const filtered = threads.filter(
    (thread) => !query || thread.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Messages</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Compose message" style={styles.iconBtn}>
            <Ionicons name="create-outline" size={22} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput accessibilityLabel="Search messages" placeholder="Search conversations" placeholderTextColor={Colors.textMuted} value={query} onChangeText={setQuery} style={styles.search} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>Booking updates from operators will appear here.</Text>
        ) : (
          filtered.map((m) => (
            <Pressable key={m.id} accessibilityRole="button" accessibilityLabel={`Message from ${m.name}`} style={[styles.thread, Shadows.card]}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{m.initial}</Text>
                </View>
                {m.online && <StatusDot size={10} style={styles.onlineDot} />}
              </View>
              <View style={styles.threadInfo}>
                <View style={styles.threadHeader}>
                  <Text style={styles.threadName}>{m.name}</Text>
                  <Text style={styles.threadTime}>{m.time}</Text>
                </View>
                <Text style={styles.threadMsg} numberOfLines={1}>{m.lastMessage}</Text>
              </View>
              {m.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{m.unread}</Text>
                </View>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginHorizontal: Spacing.xl, marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.full, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  search: { flex: 1, fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  list: { padding: Spacing.xl, gap: Spacing.sm, paddingBottom: 40 },
  thread: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.primary },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: Colors.surface },
  threadInfo: { flex: 1 },
  threadHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  threadName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, flex: 1 },
  threadTime: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  threadMsg: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginTop: 4 },
  unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xl },
});
