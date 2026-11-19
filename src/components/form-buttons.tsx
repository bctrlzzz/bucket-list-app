
// form buttons component

import { colors, fonts, fontSize, radius, spacing } from "@/constants/theme";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    submitLabel: string; // e.g: Guardar cambios
    saving: boolean; // saved or not saved
    onSubmit: () => void;
    onCancel: () => void;
}

export function FormButtons( {submitLabel, saving, onSubmit, onCancel} : Props ) {
    return (
        <View style={styles.buttons}>
            <Pressable style={styles.secondaryButton} onPress={onCancel}>
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={[ styles.primaryButton, saving && styles.buttonBusy ]} onPress={onSubmit} disabled={saving}>
                { saving ? (
                    <ActivityIndicator color={colors.onAccent} />
                ) : (
                    <Text style={styles.primaryButtonText}>{submitLabel}</Text>)
                }
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  secondaryButton: {
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.text,
  },
  primaryButton: {
    height: 36,
    // minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onAccent,
  },
  buttonBusy: {
    opacity: 0.6,
  },
});