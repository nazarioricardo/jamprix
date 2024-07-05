import { Slot } from "expo-router";
import { SessionProvider } from "../providers/SessionProvider";

export default function Layout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
