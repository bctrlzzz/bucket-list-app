import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import { StyleSheet, Text, View } from "react-native";

type Props = {
    title: string;
};

export function PlaceholderScreen({ title } : Props) {
    return (
        <View style={styles.page}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}></Text>
        </View>
    )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.title,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});