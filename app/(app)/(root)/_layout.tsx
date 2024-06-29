import { Redirect, Slot, Stack, router } from "expo-router";
import { Text } from "react-native";
import { useSession } from "../../../providers/useSession";
import { useEffect } from "react";

export default function RootLayout() {
  const { music, database, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  useEffect(() => {
    if (!music || !database) {
      router.push("/login");
    }
  }, [music && database]);

  // if (!music || !database) {
  //   return <Redirect href="/login" />;
  // }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack>
      <Stack.Screen name="/contest/create" />
    </Stack>
  );
}
