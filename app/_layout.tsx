import { Slot } from "expo-router";
import { SessionProvider } from "@/providers/SessionProvider";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
