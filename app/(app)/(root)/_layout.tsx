import { Stack, router } from "expo-router";
import { Text } from "react-native";
import { useSession } from "../../../providers/useSession";
import { useEffect } from "react";

export default function RootLayout() {
  const { userId, isLoading, signOut } = useSession();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!userId && signOut) {
      signOut();
    }
  }, [userId, isLoading]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="channel/[channelId]" options={{ title: "Channel" }} />
      <Stack.Screen
        name="channel/create"
        options={{
          presentation: "modal",
          title: "Create Channel",
        }}
      />
      <Stack.Screen
        name="submit"
        options={{
          presentation: "modal",
          title: "Submit",
        }}
      />
    </Stack>
  );
}
