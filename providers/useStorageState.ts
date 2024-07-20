import { deleteItemAsync, setItemAsync, getItemAsync } from "expo-secure-store";
import { useReducer, useEffect, useCallback } from "react";

export type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  try {
    if (value == null) {
      await deleteItemAsync(key);
    } else {
      await setItemAsync(key, value);
    }
  } catch (error) {
    console.error(error, value);
    throw error;
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
    async (value: string | null) => {
      setState(value);
      await setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
