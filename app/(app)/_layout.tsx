import { Redirect, Stack } from "expo-router";
import { useSession } from "../../providers/useSession";

export default function AppLayout() {
  const { token } = useSession();

  if (!token) {
    return <Redirect href="/auth" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
