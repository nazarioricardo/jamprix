import { useEffect } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import { useSession } from "@/providers/useSession";
import { REDIRECT_URI } from "./constants";
import { SignInProps } from "../types";
import { supabase } from "@/supabase/initSupabase";
import { useSpotifyAuth } from "./useSpotifyAuth";
import { openAuthSessionAsync } from "expo-web-browser";

function SpotifySignIn({ onSuccess, onError }: SignInProps) {
  console.log("Redirect URI", REDIRECT_URI);
  const { signIn } = useSession();
  const { request, response, promptAsync } = useSpotifyAuth();

  const parseHashFragment = (url: string) => {
    const hashPart = url.split("#")[1];
    if (!hashPart) return null;

    const params = new URLSearchParams(hashPart);
    return {
      access_token: params.get("access_token"),
      expires_in: params.get("expires_in"),
      refresh_token: params.get("refresh_token"),
      provider_token: params.get("provider_token"),
      provider_refresh_token: params.get("provider_refresh_token"),
    };
  };

  const onPressSpotifySignIn = () => {
    promptAsync();
  };

  const handleSpotifyAuth = async (spotifyCode: string) => {
    if (!signIn) {
      throw new Error("Sign in not found");
    }

    try {
      // Sign in with Supabase using the Spotify code
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "spotify",
        options: {
          skipBrowserRedirect: true,
          queryParams: {
            code: spotifyCode,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        const result = await openAuthSessionAsync(data.url, REDIRECT_URI);
        if (result.type === "success" && result.url) {
          const tokens = parseHashFragment(result.url);

          if (tokens?.access_token) {
            // Set the session using the access token
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token!,
              });

            if (!sessionData.session) {
              throw new Error("Failed to set session");
            }

            console.log(
              "session",
              JSON.stringify(sessionData.session, null, 2),
            );

            signIn(sessionData.session);
            onSuccess();
          }
        }
      }
    } catch (error) {
      console.error("Supabase auth error:", error);
      onError?.(
        error instanceof Error ? error : new Error("Authentication failed"),
      );
    }
  };

  useEffect(() => {
    if (response?.type === "success" && response.params.code) {
      handleSpotifyAuth(response.params.code);
    } else if (response?.type === "error") {
      onError?.(new Error(response.error?.message || "Authentication failed"));
    }
  }, [response]);

  return (
    <Pressable
      disabled={!request}
      onPress={onPressSpotifySignIn}
      style={styles.button}
    >
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
