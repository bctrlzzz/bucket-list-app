import { colors, fonts, fontSize, spacing } from '@/constants/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// individual tab
type Tab = {
    key: string,
    label: string, // text inside the tab
    count: number,
};

// list of tabs
type Props = {
    tabs: Tab[],
    active: string,
    onChange: (key: string) => void, // function that receives a tab's key and returns nothing
};

// switch between inside one screen
export function UnderlineTabs({tabs, active, onChange}: Props) {
    return (
        <View style={styles.row}>
            {tabs.map((tab) => {
                const isActive = tab.key === active;

                return (
                    <Pressable
                        key={tab.key}
                        onPress={()=> onChange(tab.key)}
                        style={[styles.tab, isActive && styles.tabActive]}>
                        <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
                        <Text style={styles.count}>{tab.count}</Text>
                    </Pressable>
                )
            })}
        </View>
    )
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: spacing.xl,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabActive: {
    borderBottomColor: colors.accent,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
  labelActive: {
    fontFamily: fonts.semibold,
    color: colors.accent,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
});