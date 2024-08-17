import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "@/tamagui.config";

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
