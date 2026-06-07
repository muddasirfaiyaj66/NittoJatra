import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { MESSAGE_THREADS } from '@/constants/mock-data';
import { StatusDot } from '@/components/ui';

export default function MessagesScreen() {
  const [query, setQuery] = useState('');

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
        {MESSAGE_THREADS.filter((m) => !query || m.name.toLowerCase().includes(query.toLowerCase())).map((m) => (
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
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, marginHorizontal: Spacing.xl, marginBottom: Spacing.md, paddingHorizontal: Spacing.base, borderRadius: Radius.lg, height: 44 },
  search: { flex: 1, fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  list: { padding: Spacing.xl, gap: Spacing.sm, paddingBottom: 40 },
  thread: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.primary },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: Colors.white },
  threadInfo: { flex: 1 },
  threadHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  threadName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  threadTime: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  threadMsg: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  unreadBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  unreadText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white },
});
