import { useContext } from "react";
import { SessionContext } from "./SessionProvider";

export function useSession() {
  const value = useContext(SessionContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}
