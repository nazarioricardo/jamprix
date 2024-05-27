import { useContext, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, Pressable } from "react-native";
import axios from "axios";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { supabase } from "../../supabase/initSupabase";
import { AuthContext } from "../../providers/AuthProvider";
import { useSession } from "../../providers/useSession";

const SPOTIFY_ID = "ececd6b085a7423ea9310edcb4fff94f";
const SPOTIFY_SECRET = "a4c0f07cd1ba485fbd886fc3a22728f2";
const SPOTIFY_DISCOVERY = {
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

function SpotifySignIn() {
  const { signIn } = useSession();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_ID,
      clientSecret: SPOTIFY_SECRET,
      scopes: SPOTIFY_SCOPES,
      usePKCE: false,
      responseType: "code",
      extraParams: {
        access_type: "offline",
      },
      redirectUri: makeRedirectUri({
        native: "dev.gneiss.JamPrix://",
      }),
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
            client_id: SPOTIFY_ID,
            client_secret: SPOTIFY_SECRET,
            redirect_uri: makeRedirectUri({
              native: "dev.gneiss.JamPrix://",
            }),
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then(({ data: { access_token } }) => {
          if (!signIn) {
            throw new Error(
              "Unable to set token: AuthContext instance not found."
            );
          }

          signIn(access_token);
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
