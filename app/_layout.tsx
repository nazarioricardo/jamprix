import { Slot } from "expo-router";
import { AuthProvider } from "../providers/AuthProvider";

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
