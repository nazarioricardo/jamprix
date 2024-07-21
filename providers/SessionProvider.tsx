import React, { createContext, useEffect } from "react";
import { router } from "expo-router";
import { spotifyRequest } from "../request";
import { useStorageState } from "./useStorageState";
import { supabase } from "../supabase/initSupabase";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET,
} from "../components/SpotifySignIn/constants";

const PASSWORD = "T_6*xMPseYLg6cYyGgqma@9AX!Lq3Vdw26Xn";

export enum Provider {
  APPLE = "apple",
  SPOTIFY = "spotify",
}

type AuthData = {
  access_token: string | null;
  refresh_token: string | null;
  expires_in: number;
  provider: Provider | null;
};

export type Session = AuthData & {
  userId: string | null;
};

type SessionContextProps = {
  email: string | null;
  dbUserId: string | null;
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
  const [[isLoadingDbUserId, dbUserId], setDbUserId] =
    useStorageState("db_user_id");
  const [[isLoadingAccessToken, accessToken], setAccessToken] =
    useStorageState("access_token");
  const [[isLoadingRefreshToken, refreshToken], setRefreshToken] =
    useStorageState("refresh_token");
  const [[isLoadingExpiration, expiration], setExpiration] =
    useStorageState("expiration");
  const [[isLoadingProvider, provider], setProvider] =
    useStorageState("provider");

  const setValidExpiration = (expiresIn: number) => {
    const currentTime = new Date().getTime();
    const expirationTime = expiresIn + currentTime;
    setExpiration(expirationTime + "");
  };

  const signIn = async ({
    access_token,
    refresh_token,
    expires_in,
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

    let supabaseUser;
    try {
      const { data, error } = await supabase.auth.signUp(dbCredentials);

      if (error && error.message === "User already registered") {
        const { data, error } = await supabase.auth.signInWithPassword(
          dbCredentials
        );

        if (error) {
          throw error;
        }

        supabaseUser = data.user;
      } else if (error) {
        throw error;
      } else {
        supabaseUser = data.user;
      }
    } catch (error) {
      throw error;
    }

    if (supabaseUser === null) {
      throw new Error("Db user not found");
    }

    setEmail(musicData.email);
    setUserId(musicData.id);
    setDbUserId(supabaseUser.id);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setProvider(session_provider);
    setValidExpiration(expires_in);
  };

  const signOut = () => {
    setEmail(null);
    setUserId(null);
    setAccessToken(null);
    setRefreshToken(null);
    setProvider(null);
    setExpiration(null);
    supabase.auth.signOut();

    router.navigate("/login");
  };

  const refreshIfNeeded = async () => {
    if (!expiration) {
      console.warn("Expiration is not set. Signing Out.");
      signOut();
      return;
    }

    const currentTime = new Date().getTime();
    const expirationTime = Number(expiration);

    if (currentTime > expirationTime) {
      try {
        const { data } = await spotifyRequest.post(
          "https://accounts.spotify.com/api/token",
          {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_SECRET,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        await supabase.auth.refreshSession();

        const { access_token, expires_in } = data;
        setAccessToken(access_token);
        setValidExpiration(expires_in);
      } catch (error) {
        console.error("Error Refreshing Token:", error);
        signOut();
        throw error;
      }
    } else {
      console.log("Token is still valid");
    }
  };

  const isLoadingMusic =
    isLoadingUserId ||
    isLoadingDbUserId ||
    isLoadingAccessToken ||
    isLoadingRefreshToken ||
    isLoadingProvider ||
    isLoadingExpiration;

  const isLoading = isLoadingEmail || isLoadingMusic;

  useEffect(() => {
    if (!isLoading) {
      refreshIfNeeded();
    }
  }, [isLoading]);

  return (
    <SessionContext.Provider
      value={{
        userId,
        email,
        dbUserId,
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
