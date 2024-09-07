import { StyleSheet } from "react-native";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationScope,
  signInAsync,
} from "expo-apple-authentication";
import axios from "axios";
import { useSession } from "@/providers/useSession";
import { Provider } from "@/providers/SessionProvider";
import { SignInProps } from "../types";

const APPLE_PLAYLISTS_URL = process.env.EXPO_PUBLIC_APPLE_PLAYLISTS_URL || "";

function AppleSignIn({ onSuccess, onError }: SignInProps) {
  const { signIn } = useSession();

  const onPressAppleSignIn = async () => {
    try {
      const credentials = await signInAsync({
        requestedScopes: [AppleAuthenticationScope.EMAIL],
      });

      const { authorizationCode, identityToken, user } = credentials;

      if (!authorizationCode || !identityToken) {
        throw new Error("Authorization failed");
      }

      // const developerToken = await fetchAppleDeveloperToken();

      if (signIn) {
        await signIn({
          access_token: authorizationCode,
          user_token: user,
          identity_token: identityToken,
          provider: Provider.APPLE,
        });
      } else {
        throw new Error("signIn undefined");
      }

      onSuccess();
    } catch (error) {
      onError(error as Error);
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
