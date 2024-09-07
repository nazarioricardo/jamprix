import React, { createContext, useEffect } from "react";
import { router } from "expo-router";
import { spotifyRequest } from "../request";
import { useStorageState } from "./useStorageState";
import { supabase } from "../supabase/initSupabase";
import { jwtDecode } from "jwt-decode";

export enum Provider {
  APPLE = "apple",
  SPOTIFY = "spotify",
}

type AuthData = {
  access_token: string | null;
  refresh_token?: string | null;
  expires_in?: number;
  user_token?: string;
  identity_token?: string;
  provider: Provider | null;
};

type AppleAuth = {
  aud: string;
  auth_time: number;
  c_hash: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  is_private_email: boolean;
  iss: string;
  nonce_supported: boolean;
  sub: string;
};

export type Session = AuthData & {
  userId: string | null;
};

type SessionContextProps = {
  email: string | null;
  dbUserId: string | null;
  signIn: (data: AuthData) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
} & Session;

const SessionContext = createContext<Partial<SessionContextProps>>({});

type SessionProviderProps = {
  children: React.ReactNode;
};

const USER_EXISTS_MSG = "User already registered";
const MAX_PASSWORD_LENGTH = 72;

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

  const signInToSupabase = async (musicData: { email: string; id: string }) => {
    const dbCredentials = {
      email: musicData.email,
      password: `${musicData.id}:${process.env.EXPO_PUBLIC_SUPABASE_PW}`.slice(
        0,
        MAX_PASSWORD_LENGTH,
      ),
    };

    let supabaseUser;
    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp(dbCredentials);

      const userExists = signUpError && signUpError.message === USER_EXISTS_MSG;

      if (signUpError && !userExists) {
        throw new Error(signUpError.message);
      }

      if (signUpError && signUpError.message === USER_EXISTS_MSG) {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword(dbCredentials);

        if (signInError) {
          throw new Error(signInError.message);
        }

        supabaseUser = data.user;
      } else if (signUpError) {
        throw new Error(signUpError.message);
      } else {
        supabaseUser = data.user;
      }
    } catch (error) {
      throw error;
    }

    if (supabaseUser === null) {
      throw new Error("Db user not found");
    }

    return supabaseUser;
  };

  const signInWithSpotify = async ({
    access_token,
    refresh_token,
    expires_in,
  }: AuthData) => {
    if (!refresh_token || !expires_in) {
      throw new Error("Authentication Failed: Missing Data");
    }

    let musicData;
    try {
      const { data } = await spotifyRequest.get(
        "https://api.spotify.com/v1/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      musicData = data;
    } catch (error) {
      console.error("Error Signing In:", error);
      throw error;
    }

    const supabaseUser = await signInToSupabase(musicData);

    setEmail(musicData.email);
    setUserId(musicData.id);
    setDbUserId(supabaseUser.id);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setValidExpiration(expires_in);
    setProvider(Provider.SPOTIFY);
  };

  const signInWithApple = async ({
    access_token,
    user_token,
    identity_token,
  }: AuthData) => {
    console.log("signInWithApple");
    if (!user_token || !identity_token) {
      throw new Error("Authentication Failed: Missing Data");
    }

    console.log("has user_token identity_token");

    try {
      const { exp, email } = jwtDecode(identity_token) as AppleAuth;
      await signInToSupabase({
        email: "nazarioricardo+1@gmail.com",
        id: user_token,
      });

      console.log("has exp email");
      setAccessToken(access_token);
      setUserId(user_token);
      setExpiration(String(exp));
      setProvider(Provider.APPLE);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async ({
    access_token,
    refresh_token,
    expires_in,
    user_token,
    identity_token,
    provider: session_provider,
  }: AuthData) => {
    console.log("session_provider", session_provider);
    try {
      if (session_provider === Provider.SPOTIFY) {
        await signInWithSpotify({
          access_token,
          refresh_token,
          expires_in,
          provider: session_provider,
        });
      }

      if (session_provider === Provider.APPLE) {
        console.log("will signInWithApple");
        await signInWithApple({
          access_token,
          user_token,
          identity_token,
          provider: session_provider,
        });
      }
    } catch (error) {
      throw error;
    }
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
            client_id: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
            client_secret: process.env.EXPO_PUBLIC_SPOTIFY_SECRET,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
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
