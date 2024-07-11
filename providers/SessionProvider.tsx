import React, { createContext } from "react";
import { router } from "expo-router";
import { spotifyRequest } from "../request";
import { useStorageState } from "./useStorageState";
import { supabase } from "../supabase/initSupabase";

const PASSWORD = "T_6*xMPseYLg6cYyGgqma@9AX!Lq3Vdw26Xn";

export enum Provider {
  APPLE = "apple",
  SPOTIFY = "spotify",
}

type AuthData = {
  access_token: string | null;
  refresh_token: string | null;
  provider: Provider | null;
};

export type Session = AuthData & {
  userId: string | null;
};

type SessionContextProps = {
  email: string | null;
  signIn: (data: AuthData) => void;
  signOut: () => void;
  isLoading: boolean;
} & Session;

const SessionContext = createContext<Partial<SessionContextProps>>({});

type SessionProviderProps = {
  children: React.ReactNode;
};

function SessionProvider(props: SessionProviderProps) {
  const [[isLoadingEmail, email], setEmail] = useStorageState("email");
  const [[isLoadingUserId, userId], setUserId] = useStorageState("user_id");
  const [[isLoadingAccessToken, accessToken], setAccessToken] =
    useStorageState("access_token");
  const [[isLoadingRefreshToken, refreshToken], setRefreshToken] =
    useStorageState("refresh_token");
  const [[isLoadingProvider, provider], setProvider] =
    useStorageState("provider");

  const isLoadingMusic =
    isLoadingUserId ||
    isLoadingAccessToken ||
    isLoadingRefreshToken ||
    isLoadingProvider;

  const isLoading = isLoadingEmail || isLoadingMusic;

  const signIn = async ({
    access_token,
    refresh_token,
    provider: session_provider,
  }: AuthData) => {
    let musicData;
    try {
      const { data } = await spotifyRequest.get(
        "https://api.spotify.com/v1/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      musicData = data;
    } catch (error) {
      console.error("Error Signing In:", error);
      throw error;
    }

    const dbCredentials = {
      email: musicData.email,
      password: `${musicData.id}:${PASSWORD}`,
    };

    try {
      const { error } = await supabase.auth.signUp(dbCredentials);

      if (error && error.message === "User already registered") {
        await supabase.auth.signInWithPassword(dbCredentials);
      } else if (error) {
        throw new Error("No Database Session");
      }
    } catch (error) {
      throw error;
    }

    setEmail(musicData.email);
    setUserId(musicData.id);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setProvider(session_provider);
  };

  const signOut = () => {
    setEmail(null);
    setUserId(null);
    setAccessToken(null);
    setRefreshToken(null);
    setProvider(null);
    supabase.auth.signOut();

    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.navigate("/login");
    }
  };

  return (
    <SessionContext.Provider
      value={{
        userId,
        email,
        access_token: accessToken,
        refresh_token: refreshToken,
        provider: provider as Provider | null, // why tho?
        signIn,
        signOut,
        isLoading,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}

export { SessionContext, SessionProvider };
