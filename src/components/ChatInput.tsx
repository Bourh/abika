import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const canSend = text.trim().length > 0 && !isLoading && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="اكتب رسالتك..."
          placeholderTextColor={colors.muted}
          multiline
          maxLength={2000}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={handleSend}
          editable={!disabled}
          textAlign="right"
        />
        <TouchableOpacity
          style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.75}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.bg} size="small" />
          ) : (
            <Text style={styles.sendIcon}>↑</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
    fontFamily: fonts.regular,
    maxHeight: 120,
    textAlignVertical: 'center',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.surfaceAlt,
  },
  sendIcon: {
    color: colors.bg,
    fontSize: 20,
    fontWeight: '700',
  },
});
