import React, { createContext, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../supabase/initSupabase";
import { Session } from "@supabase/supabase-js";

export type Provider = "apple" | "spotify";

type SessionContextProps = {
  email: string | undefined;
  provider: Provider | undefined;
  signIn: (session: Session) => Promise<void>;
  signOut: () => void;
  refreshSession: () => void;
};

const SessionContext = createContext<Partial<SessionContextProps>>({});

type SessionProviderProps = {
  children: React.ReactNode;
};

function SessionProvider(props: SessionProviderProps) {
  const [email, setEmail] = useState<string | undefined>();
  const [provider, setProvider] = useState<Provider | undefined>();
  // const [isLoading, setIsLoading] = useState(true);

  const signIn = async ({ user }: Session) => {
    if (!user) {
      console.error("No user!");
      return;
    }

    setEmail(user.email);
    setProvider(user.app_metadata.provider as Provider);
  };

  const signOut = () => {
    setEmail(undefined);
    supabase.auth.signOut();
    router.navigate("/login");
  };

  const refreshSession = async () => {
    // supabase handles refresh automatically with this
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("Session not found!");
      signOut();
      return;
    }

    const {
      user: {
        email,
        app_metadata: { provider },
      },
    } = session;

    setEmail(email);

    if (!provider) {
      console.error("No provider found");
      return;
    }

    setProvider(provider as Provider);
  };

  return (
    <SessionContext.Provider
      value={{
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
