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

const getAppleDeveloperToken = async (): Promise<string> => {
  const { data } = await axios.get("https://localhost:8081/dev_token");
  if (!data.token) {
    throw new Error("Failed to fetch developer token");
  }

  return data.token;
};

type AuthHeaderData = {
  accessToken: string;
  developerToken?: string;
};

let client: AxiosInstance | null = null;

export const initApiClient = async (
  headerAuthData: AuthHeaderData,
  provider: Provider,
) => {
  try {
    const { accessToken } = headerAuthData;

    if (!accessToken) {
      throw new Error(`Invalid auth data for provider: ${provider}`);
    }

    if (provider === "spotify") {
      client = createSpotifyRequest(accessToken);
    }

    if (provider === "apple") {
      const developerToken = await getAppleDeveloperToken();
      client = createAppleRequest(accessToken, developerToken);
    }
  } catch (error) {
    throw error;
  }
};

export const request = () => client;
