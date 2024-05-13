import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import axios from "axios";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

var client_id = "ececd6b085a7423ea9310edcb4fff94f"; // Your client id
var client_secret = "a4c0f07cd1ba485fbd886fc3a22728f2"; // Your secret

const APPLE_PLAYLISTS_URL =
  "https://api.music.apple.com/v1/me/library/playlists";

export default function App() {
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
          // Authorization: `Bearer [developer token]`,
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

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <AppleAuthenticationButton
        buttonType={AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={onPressAppleSignIn}
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
