import { Stack, router } from "expo-router";
import { Text } from "react-native";
import { useSession } from "../../../providers/useSession";
import { useEffect } from "react";

export default function RootLayout() {
  const { userId, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!userId) {
      router.navigate("/login");
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
          title: "Create Channel",
        }}
      />
    </Stack>
  );
}
