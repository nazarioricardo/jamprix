import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    detectSessionInUrl: false,
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});
