import { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import axios from "axios";

maybeCompleteAuthSession();

const SPOTIFY_DISCOVERY = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

var SPOTIFY_ID = "ececd6b085a7423ea9310edcb4fff94f";
var SPOTIFY_SECRET = "a4c0f07cd1ba485fbd886fc3a22728f2";

const APPLE_PLAYLISTS_URL =
  "https://api.music.apple.com/v1/me/library/playlists";

function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_ID,
      scopes: ["user-read-email", "playlist-modify-public"],
      // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: "https://gneiss.dev",
        path: "redirect",
      }),
    },
    SPOTIFY_DISCOVERY,
  );

  const onPressSpotifySignIn = () => {
    promptAsync();
  };

  const onPressAppleSignIn = async () => {
    console.log("pressed apple sign in");
    try {
      const credential = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("SUCCESS", credential);
      fetchApplePlaylists(credential.identityToken);
      // signed in
    } catch (error) {
      console.log("NOPE");
      // if (error instanceof Error) {
      // if (error.code === "ERR_REQUEST_CANCELED") {
      //   // handle that the user canceled the sign-in flow
      // }
      // }
    }
  };

  const fetchApplePlaylists = async (token: string | null) => {
    console.log("fetching playlists");

    try {
      const response = await axios.get(APPLE_PLAYLISTS_URL, {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          "Music-User-Token": `${token}`,
        },
      });

      console.log("GOTTI", response);
      // setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log("RENDERING");

  useEffect(() => {
    console.log(response);
    if (response?.type === "success") {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <AppleAuthenticationButton
        style={styles.button}
        buttonType={AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        onPress={onPressAppleSignIn}
      />
      <Button
        disabled={!request}
        title="Spotify Sign In"
        onPress={onPressSpotifySignIn}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "90%",
    height: 64,
  },
});

export default App;
