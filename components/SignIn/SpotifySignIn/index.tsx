import { StyleSheet, Text, Pressable } from "react-native";
import { useSession } from "@/providers/useSession";
import { REDIRECT_URI, SPOTIFY_SCOPES } from "./constants";
import { SignInProps } from "../types";
import { supabase } from "@/supabase/initSupabase";
import { openAuthSessionAsync } from "expo-web-browser";
import { getQueryParams } from "expo-auth-session/build/QueryParams";
import { useEffect } from "react";
import { initApiClient } from "@/request";

function SpotifySignIn({ onSuccess }: SignInProps) {
  const { signIn, signOut, session, displayName } = useSession();

  const parseTokensFromUrl = async (url: string) => {
    const { params, errorCode } = getQueryParams(url);

    if (errorCode) {
      throw new Error(errorCode);
    }

    const {
      access_token,
      refresh_token,
      provider_token,
      provider_refresh_token,
    } = params;

    if (!access_token) {
      throw new Error("No access token received");
    }

    if (!refresh_token) {
      throw new Error("No refresh token received");
    }

    if (!provider_token) {
      throw new Error("No provider token received");
    }

    if (!provider_refresh_token) {
      throw new Error("No provider refresh token received");
    }

    return {
      access_token,
      refresh_token,
      provider_token,
      provider_refresh_token,
    };
  };

  const signInToSupabase = async () => {
    const { data, error: authError } = await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        redirectTo: REDIRECT_URI,
        scopes: SPOTIFY_SCOPES.join(" "),
      },
    });

    if (authError) {
      throw authError;
    }

    if (!data.url) {
      throw new Error("No URL received from supabase auth");
    }

    return data.url;
  };

  const setSupabaseSession = async ({
    access_token,
    refresh_token,
  }: {
    access_token: string;
    refresh_token: string;
  }) => {
    const { data, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      throw sessionError;
    }

    if (!data.session) {
      throw new Error("No session received");
    }

    return data.session;
  };

  const onPressSpotifySignIn = async () => {
    try {
      const authUrl = await signInToSupabase();
      const res = await openAuthSessionAsync(authUrl, REDIRECT_URI);

      if (res.type !== "success") {
        throw new Error("Failed to open auth session async");
      }

      const tokenData = await parseTokensFromUrl(res.url);
      const { access_token, refresh_token } = tokenData;

      const newSession = await setSupabaseSession({
        access_token,
        refresh_token,
      });

      const { provider_token, provider_refresh_token } = tokenData;
      signIn(newSession, { provider_token, provider_refresh_token });
      try {
        await initApiClient({ accessToken: provider_token }, "spotify");
      } catch (error) {
        throw error;
      }

      onSuccess();
    } catch (error) {
      console.error("Auth error:", error);

      if (signOut) {
        signOut();
      }
    }
  };

  useEffect(() => {
    const upsertProfile = async () => {
      if (!session || !displayName) {
        return;
      }

      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: session.user.id,
          display_name: displayName,
          provider: "spotify",
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error(error);
      }
    };

    upsertProfile();
  }, [session?.user.id, displayName]);

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
