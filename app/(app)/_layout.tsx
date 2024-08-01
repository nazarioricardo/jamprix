import { Stack } from "expo-router";

export default function AppLayout() {
  return (
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
  );
}
