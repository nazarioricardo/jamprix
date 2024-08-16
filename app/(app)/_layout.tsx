import tamaguiConfig from "@/tamagui.config";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { TamaguiProvider } from "tamagui";

export default function AppLayout() {
  const colorScheme = useColorScheme();

  // <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
  // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={"dark"}>
      <ThemeProvider value={DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(root)" />
          <Stack.Screen
            name="login"
            options={{ presentation: "modal", gestureEnabled: false }}
          />
          <Stack.Screen
            name="profile"
            options={{
              presentation: "modal",
              title: "Profile",
            }}
          />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
