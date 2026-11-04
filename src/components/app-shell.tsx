import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/bottom-bar';
import { Sidebar } from '@/components/sidebar';
import { colors, wideBreakpoint } from '@/constants/theme';

type Props = {
    children: ReactNode;
}

export function AppShell({ children } : Props) {
    // get screen width
    const { width } = useWindowDimensions();
    // get 'safe' zones dimensions
    const insets = useSafeAreaInsets();
    const isWide = width >= wideBreakpoint;

    if (isWide) {
        return (
            <View style={styles.row}>
                <Sidebar/>
                <View style={styles.content}>{children}</View>
            </View>
        )
    }
    return (
        <View style={[styles.column, {paddingTop: insets.top }]}>
            <View style={styles.content}>{children}</View>
            <BottomBar/>
        </View>
    )
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  column: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});