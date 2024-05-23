import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../constants";

// Better put your these secret keys in .env file
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    detectSessionInUrl: false,
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});
