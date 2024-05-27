import React, { createContext, useEffect } from "react";
import { router } from "expo-router";
import { request } from "../request";
import { useStorageState } from "./useStorageState";

type ContextProps = {
  // user: null | boolean;
  musicToken: string | null;
  dbToken: string | null;
  signIn: (musicToken: string) => void;
  signOut: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [[isLoading, musicToken], setMusicToken] =
    useStorageState("musicToken");
  // const [user, setUser] = useState<null | boolean>(null);
  // const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    console.log("token", Boolean(musicToken));
    if (musicToken) {
      request.defaults.headers.Authorization = `Bearer ${musicToken}`;
      router.replace("/");
    } else {
      request.defaults.headers.Authorization = "";
      router.replace("/");
    }
  }, [musicToken]);

  const signIn = (musicToken: string) => {
    setMusicToken(musicToken);
  };

  const signOut = () => {
    setMusicToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        // user,
        musicToken,
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
