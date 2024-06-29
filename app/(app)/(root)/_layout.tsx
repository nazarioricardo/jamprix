import { Stack, router } from "expo-router";
import { Text } from "react-native";
import { useSession } from "../../../providers/useSession";
import { useEffect } from "react";

export default function RootLayout() {
  const { music, database, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!music || !database) {
      router.push("/login");
    }
  }, [music && database]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack>
      <Stack.Screen name="channel/create" />
    </Stack>
  );
}
