import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../core/types';
import { colors, fonts, radius, spacing } from '../theme';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>أ</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>
          {message.content}
        </Text>
        <Text style={styles.time}>
          {new Date(message.timestamp).toLocaleTimeString('ar', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
    marginBottom: 4,
  },
  avatarText: {
    color: colors.bg,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  bubbleUser: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: radius.xs,
  },
  bubbleAssistant: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.xs,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
    writingDirection: 'auto',
  },
  textUser: {
    color: colors.bg,
  },
  textAssistant: {
    color: colors.text,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    color: colors.muted,
    fontFamily: fonts.regular,
    textAlign: 'right',
  },
});
