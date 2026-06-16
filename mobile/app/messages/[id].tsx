import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { messageService } from '@/services/message.service';
import { useAuthStore } from '@/store/auth.store';
import { ChatMessage } from '@/types';

function formatClock(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const role = useAuthStore((s) => s.role);
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const data = await messageService.getMessages(id, role);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  }, [id, role]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollToEnd({ animated: false });
    }
  }, [messages]);

  const handleSend = async () => {
    const body = draft.trim();
    if (!body || !id || sending) return;

    setSending(true);
    setDraft('');
    try {
      const message = await messageService.sendMessage(id, body, role);
      setMessages((prev) => [...prev, message]);
    } catch (err) {
      setDraft(body);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const title = typeof name === 'string' && name.length > 0 ? name : 'Chat';

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView edges={['top']} style={styles.flex}>
        <View style={styles.nav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <View style={styles.navTitleWrap}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.subtitle}>Booking chat</Text>
          </View>
          <View style={styles.iconBtn} />
        </View>
      </SafeAreaView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {messages.map((message) => {
            if (message.senderRole === 'system') {
              return (
                <View key={message.id} style={styles.systemWrap}>
                  <Text style={styles.systemText}>{message.body}</Text>
                  <Text style={styles.systemTime}>{formatClock(message.createdAt)}</Text>
                </View>
              );
            }

            return (
              <View
                key={message.id}
                style={[styles.bubbleRow, message.isMine ? styles.rowMine : styles.rowTheirs]}
              >
                <View
                  style={[
                    styles.bubble,
                    message.isMine ? styles.bubbleMine : styles.bubbleTheirs,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      message.isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs,
                    ]}
                  >
                    {message.body}
                  </Text>
                  <Text
                    style={[
                      styles.bubbleTime,
                      message.isMine ? styles.bubbleTimeMine : styles.bubbleTimeTheirs,
                    ]}
                  >
                    {formatClock(message.createdAt)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <SafeAreaView edges={['bottom']} style={styles.composerSafe}>
        <View style={styles.composer}>
          <TextInput
            accessibilityLabel="Message text"
            placeholder="Type a message..."
            placeholderTextColor={Colors.textMuted}
            value={draft}
            onChangeText={setDraft}
            multiline
            style={styles.input}
            editable={!sending}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            onPress={() => void handleSend()}
            disabled={!draft.trim() || sending}
            style={[styles.sendBtn, (!draft.trim() || sending) && styles.sendBtnDisabled]}
          >
            {sending ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Ionicons name="send" size={18} color={Colors.white} />
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleWrap: { flex: 1, alignItems: 'center' },
  title: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  messages: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  bubbleRow: { flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm },
  bubbleTextMine: { color: Colors.white },
  bubbleTextTheirs: { color: Colors.textPrimary },
  bubbleTime: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    marginTop: 4,
  },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.75)' },
  bubbleTimeTheirs: { color: Colors.textMuted },
  systemWrap: {
    alignSelf: 'center',
    maxWidth: '90%',
    backgroundColor: Colors.surfaceIndigo,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  systemText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  systemTime: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  composerSafe: { backgroundColor: Colors.background },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
  errorText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
