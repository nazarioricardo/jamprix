import { useEffect } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import axios from "axios";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useSession } from "../../providers/useSession";
import {
  REDIRECT_URI,
  SPOTIFY_DISCOVERY,
  SPOTIFY_ID,
  SPOTIFY_SECRET,
  config,
} from "./constants";

type SpotifySignInProps = {
  onSuccess: () => void;
};

function SpotifySignIn({ onSuccess }: SpotifySignInProps) {
  const { signIn } = useSession();

  const [request, response, promptAsync] = useAuthRequest(
    config,
    SPOTIFY_DISCOVERY,
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
            client_id: SPOTIFY_ID,
            client_secret: SPOTIFY_SECRET,
            redirect_uri: REDIRECT_URI,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        )
        .then(({ data }) => {
          if (!signIn) {
            throw new Error(
              "Unable to set token: AuthContext instance not found.",
            );
          }

          return signIn(data);
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
