import { makeRedirectUri } from "expo-auth-session";

export const SPOTIFY_CLIENT_ID = "ececd6b085a7423ea9310edcb4fff94f";
export const SPOTIFY_SECRET = "a4c0f07cd1ba485fbd886fc3a22728f2";
export const SPOTIFY_DISCOVERY = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  // tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const SPOTIFY_SCOPES = [
  "user-read-email",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
];

export const REDIRECT_URI = makeRedirectUri({
  native: "dev.gneiss.JamPrix://",
});

export const config = {
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_SECRET,
  scopes: SPOTIFY_SCOPES,
  usePKCE: false,
  responseType: "code",
  extraParams: {
    access_type: "offline",
  },
  redirectUri: REDIRECT_URI,
};
