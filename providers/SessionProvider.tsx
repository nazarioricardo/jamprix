import React, { createContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "../supabase/initSupabase";
import { Session, User } from "@supabase/supabase-js";
import { initApiClient } from "@/request";

export type Provider = "apple" | "spotify";

type SessionContextProps = {
  session?: Session;
  displayName?: string;
  provider?: Provider;
  isLoading: boolean;
  signIn: (session: Session) => Promise<void>;
  signOut: () => void;
  refreshSession: () => void;
};

const defaultContext: SessionContextProps = {
  session: undefined,
  displayName: undefined,
  provider: undefined,
  isLoading: true,
  signIn: () => Promise.reject("Not implemented"),
  signOut: () => {
    throw new Error("Not implemented");
  },
  refreshSession: () => {
    throw new Error("Not implemented");
  },
};

const SessionContext = createContext<SessionContextProps>(defaultContext);
type SessionProviderProps = {
  children: React.ReactNode;
};

function SessionProvider(props: SessionProviderProps) {
  const [session, setSession] = useState<Session | undefined>();
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [provider, setProvider] = useState<Provider | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const getProvider = (user: User): Provider | undefined => {
    return user.identities?.find(({ identity_data }) => {
      return user.user_metadata.provider_id === identity_data?.provider_id;
    })?.provider as Provider;
  };

  const signIn = async (supabaseSession: Session) => {
    const { user, access_token } = supabaseSession;
    if (!user) {
      console.error("No user!");
      return;
    }

    const provider = getProvider(user);

    if (!provider) {
      console.error("Failed to parse provider from session data");
      return;
    }

    const authProvider = getProvider(user);

    // console.log(JSON.stringify(user, null, 2));

    setSession(supabaseSession);
    console.log("DISPLAY?", getDisplayName(user));
    setDisplayName(getDisplayName(user));
    setProvider(authProvider);

    try {
      await initApiClient({ accessToken: access_token }, provider);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  function getDisplayName(user: User) {
    // TODO: clean this up, make it consistent per provider
    // spotify gets it from user_metadata, and user.email is empty
    return (
      user.user_metadata?.name ||
      user.user_metadata?.email ||
      user.email ||
      user.user_metadata?.full_name ||
      "Anonymous User"
    );
  }

  const signOut = () => {
    setSession(undefined);
    setDisplayName(undefined);
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

    await signIn(session);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        displayName,
        provider,
        isLoading,
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
