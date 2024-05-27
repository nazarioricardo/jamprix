import React, { createContext, useState, useEffect } from "react";
import { router } from "expo-router";
import { request } from "../request";

type ContextProps = {
  user: null | boolean;
  // setUser: (user: boolean) => void;
  token: string | null;
  // setToken: (token: string) => void;
  signIn: (token: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<null | boolean>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("token", Boolean(token));
    if (token) {
      request.defaults.headers.Authorization = `Bearer ${token}`;
      router.replace("/");
    } else {
      request.defaults.headers.Authorization = "";
      router.replace("/");
    }
  }, [token]);

  const signIn = (token: string) => {
    setToken(token);
  };

  const signOut = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
