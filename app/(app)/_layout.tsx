import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";
import { useSession } from "../../providers/useSession";

export default function AppLayout() {
  const { musicToken, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!musicToken) {
    return <Redirect href="/auth" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
