import { Slot } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "@/tamagui.config";
import { SessionProvider } from "@/providers/SessionProvider";

export default function Layout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </TamaguiProvider>
  );
}
