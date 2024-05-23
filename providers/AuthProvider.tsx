import React, { createContext, useState, useEffect } from "react";
import { request } from "../request";

type ContextProps = {
  user: null | boolean;
  setUser: (user: boolean) => void;
  token: string | null;
  setToken: (token: string) => void;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<null | boolean>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      request.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      request.defaults.headers.Authorization = "";
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
