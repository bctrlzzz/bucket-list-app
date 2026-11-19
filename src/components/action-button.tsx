import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';

type Props = {
  icon: ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function ActionButton({ icon, label, onPress, disabled = false }: Props) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}>
      <Feather name={icon} size={14} color={colors.text} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 34,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.text,
  },
});