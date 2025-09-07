import { Stack } from "expo-router";
import { Text } from "tamagui";
import { useSession } from "@/providers/useSession";
import ProfileButton from "@/components/ProfileButton";
import CreateChannelButton from "@/components/CreateChannelButton";

export default function RootLayout() {
  const { isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerLeft: ProfileButton,
          headerRight: CreateChannelButton,
        }}
      />
      <Stack.Screen name="channel/[channelId]" options={{ title: "Channel" }} />
      <Stack.Screen
        name="channel/create"
        options={{
          presentation: "modal",
          title: "Create Channel",
          headerShown: false,
        }}
      />
      <Stack.Screen name="event/[eventId]" options={{ title: "Event" }} />
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
