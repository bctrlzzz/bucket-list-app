import { Feather } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navItems } from '@/constants/navigation';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';

export function Sidebar() {
    // highlight current nav item
    const pathname = usePathname();
    
    return (
        <View style={styles.sidebar}>
            <View style={styles.brand}>
                <View style={styles.logo}>
                    <Text style={styles.logoText}></Text>
                </View>
                <Text style={styles.brandText}>bucket list app</Text>
            </View>

        {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
                <Link key={item.label} href={item.href} asChild>
                    <Pressable style={isActive ? styles.itemActive : styles.item}>
                        <Feather name={item.icon} size={15} color={isActive ? colors.accent : colors.text}/>
                        <Text style={isActive ? styles.labelActive : styles.label}> {item.label} </Text>
                    </Pressable>
                </Link>
            )
        })}
        </View>
    )
}

const styles = StyleSheet.create({
  sidebar: {
    width: 216,
    backgroundColor: colors.sidebar,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: spacing.lg,
    gap: 2,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.heading,
    color: colors.onAccent,
  },
  brandText: {
    fontFamily: fonts.regular,
    fontSize: 19,
    color: colors.text,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.md,
  },
  itemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.text,
  },
  labelActive: {
    fontFamily: fonts.regular,
    fontSize: fontSize.body,
    color: colors.accent,
  },
});