import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";

// const JamDarkTheme: Theme = {
//   ...DarkTheme,
//   colors: {
//     ...DarkTheme.colors,
//     primary: tamaguiConfig.themes.dark.accentColor.val,
//     background: tamaguiConfig.themes.dark.background.val,
//   },
// };

export default function AppLayout() {
  // const colorScheme = useColorScheme();

  // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
  return (
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
  );
}
