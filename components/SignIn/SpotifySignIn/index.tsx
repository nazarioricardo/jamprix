import { StyleSheet, Text, Pressable } from "react-native";
import { useSession } from "@/providers/useSession";
import { REDIRECT_URI, SPOTIFY_SCOPES } from "./constants";
import { SignInProps } from "../types";
import { supabase } from "@/supabase/initSupabase";
import { openAuthSessionAsync } from "expo-web-browser";
import { getQueryParams } from "expo-auth-session/build/QueryParams";

function SpotifySignIn({ onSuccess }: SignInProps) {
  const { signIn, signOut } = useSession();

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) throw error;
    return data.session;
  };

  const onPressSpotifySignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo: REDIRECT_URI,
          scopes: SPOTIFY_SCOPES.join(" "),
        },
      });

      if (error) throw error;

      if (data?.url) {
        const res = await openAuthSessionAsync(data.url, REDIRECT_URI);

        if (res.type === "success") {
          const session = await createSessionFromUrl(res.url);
          if (session && signIn) {
            signIn(session);
            onSuccess();
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error);

      if (signOut) {
        signOut();
      }
    }
  };

  return (
    <Pressable onPress={onPressSpotifySignIn} style={styles.button}>
      {({ pressed }) => (
        <Text style={[styles.text, pressed ? styles.pressedText : null]}>
          Sign in with Spotify
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: 64,
    borderRadius: 5,
    backgroundColor: "black",
  },
  text: {
    color: "white",
    fontSize: 25,
    fontWeight: "semibold",
  },
  pressedText: {
    opacity: 0.5,
  },
});

export default SpotifySignIn;
