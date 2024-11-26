import { makeRedirectUri } from "expo-auth-session";

export const SPOTIFY_DISCOVERY = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  // tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export const SPOTIFY_SCOPES = [
  "user-read-email",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
];

export const REDIRECT_URI = makeRedirectUri({
  scheme: "dev.gneiss.jamprix",
  path: "callback",
});
