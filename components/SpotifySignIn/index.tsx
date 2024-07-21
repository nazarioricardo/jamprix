import { useEffect } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import axios from "axios";
import { useAuthRequest } from "expo-auth-session";
import { useSession } from "../../providers/useSession";
import { REDIRECT_URI, SPOTIFY_DISCOVERY, SPOTIFY_SCOPES } from "./constants";
import { Provider } from "../../providers/SessionProvider";

type SpotifySignInProps = {
  onSuccess: () => void;
};

function SpotifySignIn({ onSuccess }: SpotifySignInProps) {
  const { signIn } = useSession();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.EXPO_PUBLIC_SPOTIFY_SECRET || "",
      scopes: SPOTIFY_SCOPES,
      usePKCE: false,
      responseType: "code",
      extraParams: {
        access_type: "offline",
      },
      redirectUri: REDIRECT_URI,
    },
    SPOTIFY_DISCOVERY
  );

  const onPressSpotifySignIn = () => {
    promptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      axios
        .post(
          "https://accounts.spotify.com/api/token",
          {
            code,
            grant_type: "authorization_code",
            client_id: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
            client_secret: process.env.EXPO_PUBLIC_SPOTIFY_SECRET,
            redirect_uri: REDIRECT_URI,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then(({ data }) => {
          if (!signIn) {
            throw new Error(
              "Unable to set token: AuthContext instance not found."
            );
          }

          return signIn({ ...data, provider: Provider.SPOTIFY });
        })
        .then(() => {
          onSuccess();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [response]);

  return (
    <Pressable
      disabled={!request}
      onPress={onPressSpotifySignIn}
      style={styles.button}
    >
      {({ pressed }) => (
        <Text style={[styles.text, pressed ? styles.pressedText : null]}>
          Sign in with Spotify
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: 64,
    borderRadius: 5,
    backgroundColor: "black",
  },
  text: {
    color: "white",
    fontSize: 25,
    fontWeight: "semibold",
  },
  pressedText: {
    opacity: 0.5,
  },
});

export default SpotifySignIn;
