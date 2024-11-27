import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  process.env.EXPO_PUBLIC_SUPABASE_KEY || "",
  {
    auth: {
      detectSessionInUrl: false,
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
  },
);
