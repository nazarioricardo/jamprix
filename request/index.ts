import { Provider } from "@/providers/SessionProvider";
import axios, { AxiosInstance } from "axios";

const createSpotifyRequest = (token: string) => {
  return axios.create({
    baseURL: "https://api.spotify.com/v1",
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const createAppleRequest = (userToken: string, developerToken: string) => {
  return axios.create({
    baseURL: "https://api.music.apple.com/v1",
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${developerToken}`,
      "Music-User-Token": userToken,
      "Content-Type": "application/json",
    },
  });
};

type AuthHeaderData = {
  accessToken: string;
  developerToken?: string;
};

let client: AxiosInstance | null = null;

export const initApiClient = (
  headerAuthData: AuthHeaderData,
  provider: Provider,
) => {
  const { accessToken, developerToken } = headerAuthData;
  if (provider === "spotify" && "accessToken" in headerAuthData) {
    client = createSpotifyRequest(accessToken);
  }

  if (provider === "apple" && developerToken) {
    client = createAppleRequest(accessToken, developerToken);
  }

  throw new Error(`Invalid auth data for provider: ${provider}`);
};

export const request = () => client;
