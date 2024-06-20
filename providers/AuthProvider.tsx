import React, { createContext, useEffect } from "react";
import { router } from "expo-router";
import { spotifyRequest } from "../request";
import { useStorageState } from "./useStorageState";
import { supabase } from "../supabase/initSupabase";

const PASSWORD = "T_6*xMPseYLg6cYyGgqma@9AX!Lq3Vdw26Xn";

type MusicAuthData = {
  access_token: string;
  refresh_token: string;
};

type ContextProps = {
  email: string | null;
  musicId: string | null;
  musicToken: string | null;
  musicRefreshToken: string | null;
  dbId: string | null;
  dbToken: string | null;
  dbRefreshToken: string | null;
  signIn: (data: MusicAuthData) => void;
  signOut: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<Partial<ContextProps>>({});

type Props = {
  children: React.ReactNode;
};

const AuthProvider = (props: Props) => {
  const [[isLoadingMusicToken, musicToken], setMusicToken] =
    useStorageState("musicAuth");
  const [
    [isLoadingMusicRefreshToken, musicRefreshToken],
    setMusicRefreshToken,
  ] = useStorageState("musicRefreshToken");
  const [[isLoadingMusicId, musicId], setMusicId] = useStorageState("musicId");
  const [[isLoadingEmail, email], setEmail] = useStorageState("email");

  const [[isLoadingDbId, dbId], setDbId] = useStorageState("dbId");
  const [[isLoadingDbToken, dbToken], setDbToken] = useStorageState("dbToken");
  const [[isLoadingDbRefreshToken, dbRefreshToken], setDbRefreshToken] =
    useStorageState("dbRefreshToken");

  const isLoading =
    isLoadingMusicToken ||
    isLoadingMusicRefreshToken ||
    isLoadingDbId ||
    isLoadingDbToken ||
    isLoadingDbRefreshToken ||
    isLoadingMusicId ||
    isLoadingEmail;

  useEffect(() => {
    console.log("token", Boolean(musicToken));
    router.replace("/");
  }, [musicToken]);

  const signIn = async ({ access_token, refresh_token }: MusicAuthData) => {
    let musicData;
    try {
      const { data } = await spotifyRequest.get(
        "https://api.spotify.com/v1/me",
        {
          headers: { Authorization: `Bearer ${access_token}` },
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

    setMusicToken(access_token);
    setMusicRefreshToken(refresh_token);
    setMusicId(id);
    setDbToken(dbData.session.access_token);
    setDbRefreshToken(dbData.session.refresh_token);
    setDbId(dbData.session.user.id);
    setEmail(email);
  };

  const signOut = () => {
    setMusicToken(null);
    setMusicToken(null);
    setMusicRefreshToken(null);
    setMusicId(null);
    setDbToken(null);
    setDbRefreshToken(null);
    setDbId(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        musicToken,
        musicRefreshToken,
        musicId,
        dbId,
        dbToken,
        dbRefreshToken,
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
