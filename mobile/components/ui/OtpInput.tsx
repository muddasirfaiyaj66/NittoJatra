import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, Radius, Typography } from '@/constants/theme';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  accessibilityLabel?: string;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  autoFocus = true,
  accessibilityLabel = 'One-time password',
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable
      accessibilityRole="none"
      onPress={() => inputRef.current?.focus()}
      style={styles.row}
    >
      <TextInput
        ref={inputRef}
        accessibilityLabel={accessibilityLabel}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        style={styles.hiddenInput}
      />
      {Array.from({ length }).map((_, index) => {
        const filled = index < value.length;
        const active = index === value.length;
        return (
          <View
            key={index}
            style={[styles.box, filled && styles.boxFilled, active && styles.boxActive]}
          >
            <Text style={styles.digit}>{value[index] ?? ''}</Text>
          </View>
        );
      })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  box: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.borderMid,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  boxFilled: {
    borderColor: Colors.primary,
  },
  boxActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  digit: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.lg,
    color: Colors.textPrimary,
  },
});
