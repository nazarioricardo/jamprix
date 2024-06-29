import { deleteItemAsync, setItemAsync, getItemAsync } from "expo-secure-store";
import { useReducer, useEffect, useCallback } from "react";

export type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

export function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null,
    ): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (value == null) {
    await deleteItemAsync(key);
  } else {
    await setItemAsync(key, value);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  useEffect(() => {
    getItemAsync(key).then((value) => {
      setState(value);
    });
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key],
  );

  return [state, setValue];
}
