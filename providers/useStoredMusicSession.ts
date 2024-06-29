import { useEffect, useCallback } from "react";
import { getItemAsync } from "expo-secure-store";
import { MusicSession } from "./AuthProvider";
import {
  UseStateHook,
  setStorageItemAsync,
  useStorageState,
} from "./useStorageState";

const KEY = "music_session";
export function useStoredMusicSession(): UseStateHook<MusicSession> {
  const [[isLoadingMusic, music], setMusic] = useStorageState(KEY);

  useEffect(() => {
    getItemAsync(KEY).then((value) => {
      if (value) {
        setMusic(JSON.parse(value));
      } else {
        setMusic(null);
      }
    });
  }, []);

  // Set
  const setSession = useCallback((value: MusicSession | null) => {
    console.log("setting session", value);
    if (value) {
      setMusic(JSON.stringify(value));
    }

    setStorageItemAsync(KEY, JSON.stringify(value));
  }, []);

  if (typeof music === "string") {
    // console.log(music);
    return [[isLoadingMusic, JSON.parse(music)], setSession];
  } else if (typeof music === "object") {
    return [[isLoadingMusic, music], setSession];
  }

  return [[isLoadingMusic, null], setSession];
}
