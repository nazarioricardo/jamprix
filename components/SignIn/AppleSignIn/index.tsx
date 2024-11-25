import { StyleSheet } from "react-native";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationScope,
  AppleAuthenticationCredentialState,
  signInAsync,
  isAvailableAsync,
} from "expo-apple-authentication";
import axios from "axios";
import { useSession } from "@/providers/useSession";
import { Provider } from "@/providers/SessionProvider";
import { SignInProps } from "../types";
import { supabase } from "@/supabase/initSupabase";

const APPLE_PLAYLISTS_URL = process.env.EXPO_PUBLIC_APPLE_PLAYLISTS_URL || "";

function AppleSignIn({ onSuccess, onError }: SignInProps) {
  const { signIn } = useSession();

  const checkAppleAvailability = async () => {
    try {
      const isAvailable = await isAvailableAsync();
      console.log("Apple Sign In available:", isAvailable);
      return isAvailable;
    } catch (error) {
      console.log("Availability check error:", error);
      return false;
    }
  };

  const onPress = async () => {
    const isAvailable = checkAppleAvailability();

    if (!isAvailable) {
      console.log("Apple Sign In is not available");
      return;
    }

    try {
      const credential = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("Apple credential received:", credential);

      // Sign in via Supabase Auth.
      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        if (error) {
          console.log("Supabase error:", error);
          throw error;
        }

        console.log("success!", data);
      } else {
        throw new Error("No identityToken.");
      }
    } catch (e) {
      console.error(e);
      // if (e.code === "ERR_REQUEST_CANCELED") {
      //   // handle that the user canceled the sign-in flow
      // } else {
      //   // handle other errors
      // }
    }
  };

  return (
    <AppleAuthenticationButton
      buttonType={AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: 200, height: 64 }}
      onPress={onPress}
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
