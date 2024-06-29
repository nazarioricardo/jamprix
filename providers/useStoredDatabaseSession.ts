import { useEffect, useCallback } from "react";
import { getItemAsync } from "expo-secure-store";
import { DatabaseSession } from "./AuthProvider";
import {
  UseStateHook,
  setStorageItemAsync,
  useStorageState,
} from "./useStorageState";

const KEY = "database_session";
export function useStoredDatabaseSession(): UseStateHook<DatabaseSession> {
  const [[isLoadingDatabase, database], setDatabase] = useStorageState(KEY);

  useEffect(() => {
    getItemAsync(KEY).then((value) => {
      if (value) {
        setDatabase(JSON.parse(value));
      } else {
        setDatabase(null);
      }
    });
  }, []);

  // Set
  const setSession = useCallback((value: DatabaseSession | null) => {
    if (value) {
      setDatabase(JSON.stringify(value));
    }

    setStorageItemAsync(KEY, JSON.stringify(value));
  }, []);

  if (typeof database === "string") {
    return [[isLoadingDatabase, JSON.parse(database)], setSession];
  } else if (typeof database === "object") {
    return [[isLoadingDatabase, database], setSession];
  }

  return [[isLoadingDatabase, null], setSession];
}
