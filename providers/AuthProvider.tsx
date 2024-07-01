import React, { createContext } from "react";
import { router } from "expo-router";
import { spotifyRequest } from "../request";
import { useStorageState } from "./useStorageState";
import { supabase } from "../supabase/initSupabase";
import { useStoredMusicSession } from "./useStoredMusicSession";
import { useStoredDatabaseSession } from "./useStoredDatabaseSession";

const PASSWORD = "T_6*xMPseYLg6cYyGgqma@9AX!Lq3Vdw26Xn";

type AuthData = {
  access_token: string;
  refresh_token: string;
};

export type DatabaseSession = AuthData & {
  id: string;
};

export type MusicSession = AuthData & {
  id: string;
  type: "apple" | "spotify";
};

type ContextProps = {
  email: string | null;
  music: MusicSession | null;
  database: DatabaseSession | null;
  signIn: (data: AuthData) => void;
  signOut: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<Partial<ContextProps>>({});

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = (props: AuthProviderProps) => {
  const [[isLoadingEmail, email], setEmail] = useStorageState("email");
  const [[isLoadingMusic, music], setMusic] = useStoredMusicSession();
  const [[isLoadingDatabase, database], setDatabase] =
    useStoredDatabaseSession();

  const isLoading = isLoadingEmail || isLoadingMusic || isLoadingDatabase;

  const signIn = async ({ access_token, refresh_token }: AuthData) => {
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

    const { id, email } = musicData;

    let dbData;
    const dbCredentials = {
      email,
      password: `${id}:${PASSWORD}`,
    };

    try {
      const { data, error } = await supabase.auth.signUp(dbCredentials);
      if (error && error.message === "User already registered") {
        const { data } = await supabase.auth.signInWithPassword(dbCredentials);
        dbData = data;
      } else {
        dbData = data;
      }
    } catch (error) {
      console.error("supabase auth error:", error);
      throw error;
    }

    if (!dbData.session) {
      throw new Error("No Database Session");
    }

    try {
      const musicSession: MusicSession = {
        id,
        access_token,
        refresh_token,
        type: "spotify",
      };

      const databaseSession: DatabaseSession = {
        id: dbData.session.user.id,
        access_token: dbData.session.access_token,
        refresh_token: dbData.session.refresh_token,
      };

      setMusic(musicSession);
      setDatabase(databaseSession);
      setEmail(email);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    setMusic(null);
    setDatabase(null);
    setEmail(null);
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        music,
        database,
        email,
        signIn,
        signOut,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
