import { ResponseType } from "expo-auth-session";
import { REDIRECT_URI, SPOTIFY_DISCOVERY, SPOTIFY_SCOPES } from "./constants";
import { useAuthRequest } from "expo-auth-session";

export const useSpotifyAuth = () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.EXPO_PUBLIC_SPOTIFY_SECRET || "",
      scopes: SPOTIFY_SCOPES,
      usePKCE: true,
      responseType: ResponseType.Code,
      extraParams: {
        access_type: "offline",
      },
      redirectUri: REDIRECT_URI,
    },
    SPOTIFY_DISCOVERY
  );

  return { request, response, promptAsync };
};
