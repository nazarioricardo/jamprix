import React, { createContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../supabase/initSupabase";
import { Session, User } from "@supabase/supabase-js";
import { initApiClient } from "@/request";

export type Provider = "apple" | "spotify";

type SessionContextProps = {
  userId: string | undefined;
  email: string | undefined;
  provider: Provider | undefined;
  signIn: (session: Session) => void;
  signOut: () => void;
  refreshSession: () => void;
};

const SessionContext = createContext<Partial<SessionContextProps>>({});

type SessionProviderProps = {
  children: React.ReactNode;
};

function SessionProvider(props: SessionProviderProps) {
  const [userId, setUserId] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [provider, setProvider] = useState<Provider | undefined>();

  const getProvider = (user: User): Provider | undefined => {
    return user.identities?.find(({ identity_data }) => {
      return user.user_metadata.provider_id === identity_data?.provider_id;
    })?.provider as Provider;
  };

  const signIn = ({ user, access_token }: Session) => {
    if (!user) {
      console.error("No user!");
      return;
    }

    const provider = getProvider(user);

    if (!provider) {
      console.error("Failed to parse provider from session data");
      return;
    }

    setUserId(user.id);
    setEmail(user.email);
    setProvider(provider);

    initApiClient({ accessToken: access_token }, provider);
  };

  const signOut = () => {
    setUserId(undefined);
    setEmail(undefined);
    setProvider(undefined);
    supabase.auth.signOut();
    router.navigate("/login");
  };

  const refreshSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("Session not found!");
      signOut();
      return;
    }

    signIn(session);
  };

  return (
    <SessionContext.Provider
      value={{
        userId,
        email,
        provider,
        signIn,
        signOut,
        refreshSession,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}

export { SessionContext, SessionProvider };
