import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

// reusable text field

type Props = {
    label: string,
    value: string,
    onChangeText: (text: string) => void;
    placeholder?: string,
    required?: boolean
    keyboardType?: TextInputProps['keyboardType']; // only real keyboard names
};

export function TextField({ label, value, onChangeText, placeholder, required, keyboardType}: Props) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>
                {label}
                {required ? ' *' : ''}
            </Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                keyboardType={keyboardType}
            ></TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSize.small,
    color: colors.textMuted,
  },
  input: {
    height: 40,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.text,
  },
});