import { StyleSheet } from "react-native";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import axios from "axios";

const APPLE_PLAYLISTS_URL = process.env.EXPO_PUBLIC_APPLE_PLAYLISTS_URL || "";

function AppleSignIn() {
  const onPressAppleSignIn = async () => {
    console.log("pressed apple sign in");
    let credentials;
    try {
      credentials = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL,
        ],
      });

      fetchApplePlaylists(credentials.identityToken);
    } catch (error) {
      // if (error instanceof Error) {
      //   if (error.code === "ERR_REQUEST_CANCELED") {
      //     // handle that the user canceled the sign-in flow
      //   }
      // }
    }
  };

  const fetchApplePlaylists = async (userToken: string | null) => {
    const developerToken = await fetchAppleDeveloperToken();

    try {
      const res = await axios.get(APPLE_PLAYLISTS_URL, {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          "Music-User-Token": userToken,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAppleDeveloperToken = async () => {
    const {
      data: { token },
    } = await axios.get("http://127.0.0.1:8000/apple_token");

    return token;
  };

  // const generateCodeVerifier = (length: number) => {
  //   let text = "";
  //   let possible =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  //   for (let i = 0; i < length; i++) {
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   }
  //   return text;
  // };

  return (
    <AppleAuthenticationButton
      style={styles.button}
      buttonType={AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      onPress={onPressAppleSignIn}
    />
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

export default AppleSignIn;
