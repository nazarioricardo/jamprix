import React, { createContext } from "react";
import { router } from "expo-router";
import { spotifyRequest } from "../request";
import { useStorageState } from "./useStorageState";
import { supabase } from "../supabase/initSupabase";

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
  music: MusicSession;
  database: DatabaseSession;
  signIn: (data: AuthData) => void;
  signOut: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<Partial<ContextProps>>({});

type AuthProviderProps = {
  children: React.ReactNode;
};

const DB_KEY = "database_session__";
const MUSIC_KEY = "music_session__";
const AuthProvider = (props: AuthProviderProps) => {
  const [[isLoadingEmail, email], setEmail] = useStorageState("email");

  const [[isLoadingDbId, dbId], setDbId] = useStorageState(DB_KEY + "id");
  const [[isLoadingDbAccessToken, dbAccessToken], setDbAccessToken] =
    useStorageState(DB_KEY + "access_token");
  const [[isLoadingDbRefreshToken, dbRefreshToken], setDbRefreshToken] =
    useStorageState(DB_KEY + "refresh_token");

  const [[isLoadingMusicId, musicId], setMusicId] = useStorageState(
    MUSIC_KEY + "id",
  );
  const [[isLoadingMusicAccessToken, musicAccessToken], setMusicAccessToken] =
    useStorageState(MUSIC_KEY + "access_token");
  const [
    [isLoadingMusicRefreshToken, musicRefreshToken],
    setMusicRefreshToken,
  ] = useStorageState(MUSIC_KEY + "refresh_token");
  const [[isLoadingMusicType, musicType], setMusicType] = useStorageState(
    MUSIC_KEY + "type",
  );

  const isLoadingMusic =
    isLoadingMusicId ||
    isLoadingMusicAccessToken ||
    isLoadingMusicRefreshToken ||
    isLoadingMusicType;

  const isLoadingDb =
    isLoadingDbId || isLoadingDbAccessToken || isLoadingDbRefreshToken;

  const isLoading = isLoadingEmail || isLoadingMusic || isLoadingDb;

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

      setEmail(email);
      setDbId(dbData.session.user.id);
      setDbAccessToken(dbData.session.access_token);
      setDbRefreshToken(dbData.session.refresh_token);
      setMusicId(musicSession.id);
      setMusicAccessToken(musicSession.access_token);
      setMusicRefreshToken(musicSession.refresh_token);
      setMusicType(musicSession.type);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signOut = () => {
    setEmail(null);
    setDbId(null);
    setDbAccessToken(null);
    setDbRefreshToken(null);
    setMusicId(null);
    setMusicAccessToken(null);
    setMusicRefreshToken(null);
    setMusicType(null);
    // supabase.auth.signOut()
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.navigate("/login");
    }
  };

  const hasMusicSession = Boolean(
    musicId && musicAccessToken && musicRefreshToken && musicType,
  );

  const hasDbSession = Boolean(dbId && dbAccessToken && dbRefreshToken);

  return (
    <AuthContext.Provider
      value={{
        email,
        signIn,
        signOut,
        isLoading,
        music: hasMusicSession
          ? ({
              id: musicId,
              access_token: musicAccessToken,
              refresh_token: musicRefreshToken,
              type: musicType,
            } as MusicSession)
          : undefined,
        database: hasDbSession
          ? ({
              id: dbId ? dbId.replace(/^"|"$/g, "") : null,
              access_token: dbAccessToken,
              refresh_token: dbRefreshToken,
            } as DatabaseSession)
          : undefined,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
