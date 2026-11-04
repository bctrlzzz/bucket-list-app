import { Feather } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navItems } from '@/constants/navigation';
import { colors, spacing } from '@/constants/theme';

export function BottomBar() {
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const phoneItems = navItems.filter((item) => item.showOnPhone);

    return (
        <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm )}] }>
            {phoneItems.map((item) => {
                const isActive = pathname === item.href;
                const color = isActive ? colors.accent : colors.textMuted;

                return (
                    <Link key={item.label} href={item.href} asChild>
                        <Pressable style={styles.item}>
                            <Feather name={item.icon} size={20} color={color} />
                        </Pressable>
                    </Link>
                )
            })}
             
        </View>
    )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
//   label: {
//     fontFamily: fonts.regular,
//     fontSize: fontSize.caption,
//   },
});