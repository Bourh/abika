import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { useChat } from '../hooks/useChat';
import { Message } from '../core/types';
import { colors, fonts, spacing } from '../theme';

export function ChatScreen() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const listRef = useRef<FlatList<Message>>(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>أ</Text>
      <Text style={styles.emptyTitle}>أبيكا</Text>
      <Text style={styles.emptySubtitle}>نواتك الذكية — جاهزة للتوسع</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.onlineDot} />
          <View>
            <Text style={styles.headerTitle}>أبيكا</Text>
            <Text style={styles.headerSub}>
              {isLoading ? 'يكتب...' : 'جاهز'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>مسح</Text>
        </TouchableOpacity>
      </View>

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            messages.length === 0 ? styles.emptyList : styles.list
          }
          showsVerticalScrollIndicator={false}
        />

        {/* ── Error Banner ── */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}

        {/* ── Input ── */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },

  // ─── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ED573',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 17,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  headerSub: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  clearBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  clearBtnText: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: fonts.regular,
  },

  // ─── List ──────────────────────────────────────────────────────────────────
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Empty State ──────────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    color: colors.accent,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },
  emptySubtitle: {
    color: colors.muted,
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },

  // ─── Error ────────────────────────────────────────────────────────────────
  errorBanner: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: '#FF456020',
    borderRadius: 8,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#FF456040',
  },
  errorText: {
    color: '#FF4560',
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
});
