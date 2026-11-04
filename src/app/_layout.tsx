import { AppShell } from "@/components/app-shell";
import { colors } from "@/constants/theme";
import { Inter_400Regular, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import { Slot } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { StyleSheet } from "react-native";

// splash screen visible until fonts are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  
  // return (
  //   <View style={styles.app}>
  //     <Sidebar/>
  //     <View style={styles.content}>
  //       {/* current screen inside Slot */}
  //       <Slot/>
  //     </View>
  //   </View>
  // );

  return (
    <AppShell>
      <Slot/>
    </AppShell>
  )
}

const styles = StyleSheet.create ({
  app: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  }
})
