import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function MyPlansScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
        <Text style={styles.title}> Mis planes </Text>
        <Text style={styles.subtitle}> Las ideas de hoy, los buenos recuerdos de mañana. </Text>

      <View style={styles.sectionHeader}>
         <Text style={styles.sectionTitle}> Planes por hacer </Text>
         <Text style={styles.count}></Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.heading,
    color: colors.text,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});