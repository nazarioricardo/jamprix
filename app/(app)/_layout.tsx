import { tamaguiConfig } from "@/tamagui.config";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider, useTheme } from "tamagui";

const JamDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: tamaguiConfig.themes.dark.accentColor.val,
    background: tamaguiConfig.themes.dark.background.val,
  },
};

const JamLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: tamaguiConfig.themes.light.accentColor.val,
    background: tamaguiConfig.themes.light.background.val,
  },
};

export default function AppLayout() {
  // const colorScheme = useColorScheme();

  // <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
  // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={"dark"}>
      <ThemeProvider value={JamDarkTheme}>
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
