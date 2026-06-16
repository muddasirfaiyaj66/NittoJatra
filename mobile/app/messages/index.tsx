import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { chatRoute } from '@/constants/routes';
import { StatusDot } from '@/components/ui';
import { messageService } from '@/services/message.service';
import { MessageThread } from '@/types';

export default function MessagesScreen() {
  const [query, setQuery] = useState('');
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await messageService.listConversations();
      setThreads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadThreads();
    }, [loadThreads]),
  );

  const filtered = threads.filter(
    (thread) =>
      !query ||
      thread.name.toLowerCase().includes(query.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Messages</Text>
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            accessibilityLabel="Search messages"
            placeholder="Search conversations"
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            style={styles.search}
          />
        </View>
      </SafeAreaView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void loadThreads(true);
              }}
              tintColor={Colors.primary}
            />
          }
        >
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {filtered.length === 0 ? (
            <Text style={styles.emptyText}>
              {error
                ? 'Pull down to retry.'
                : 'Booking chats with operators will appear here after you book a ride.'}
            </Text>
          ) : (
            filtered.map((thread) => (
              <Pressable
                key={thread.id}
                accessibilityRole="button"
                accessibilityLabel={`Message from ${thread.name}`}
                onPress={() => router.push(chatRoute(thread.id, thread.name))}
                style={[styles.thread, Shadows.card]}
              >
                <View style={styles.avatarWrap}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{thread.initial}</Text>
                  </View>
                  {thread.online && <StatusDot size={10} style={styles.onlineDot} />}
                </View>
                <View style={styles.threadInfo}>
                  <View style={styles.threadHeader}>
                    <Text style={styles.threadName}>{thread.name}</Text>
                    <Text style={styles.threadTime}>{thread.time}</Text>
                  </View>
                  <Text style={styles.threadMsg} numberOfLines={1}>
                    {thread.lastMessage}
                  </Text>
                </View>
                {thread.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{thread.unread}</Text>
                  </View>
                )}
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  search: {
    flex: 1,
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  list: { padding: Spacing.xl, gap: Spacing.sm, paddingBottom: 40 },
  thread: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceIndigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.primary },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  threadInfo: { flex: 1 },
  threadHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  threadName: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  threadTime: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
  },
  threadMsg: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
  },
  emptyText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  errorText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
