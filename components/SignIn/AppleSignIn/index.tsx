import { StyleSheet } from "react-native";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationScope,
  signInAsync,
  isAvailableAsync,
} from "expo-apple-authentication";
import { SignInProps } from "../types";
import { supabase } from "@/supabase/initSupabase";
import { useSession } from "@/providers/useSession";
import { useEffect } from "react";

// const APPLE_PLAYLISTS_URL = process.env.EXPO_PUBLIC_APPLE_PLAYLISTS_URL || "";

function AppleSignIn({ onSuccess }: SignInProps) {
  const { signIn, userId, displayName, provider } = useSession();

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
    if (!signIn) {
      throw new Error("Sign in not found");
    }

    const isAvailable = await checkAppleAvailability();

    if (!isAvailable) {
      throw new Error("Apple Sign In is not available");
    }

    try {
      const credential = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("Apple credential received:", credential);

      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

        if (error) {
          console.log("Failed Supabase sign in:", error);
          if (error.code === "ERR_REQUEST_CANCELED") {
            return;
          }

          throw new Error(error.message);
        }

        console.log("success!", data.session.user.id);
        await signIn(data.session);
        onSuccess();
      } else {
        throw new Error("No identityToken provided");
      }
    } catch (error) {
      // if (error instanceof Error) {
      //   // onError(error);
      // } else {
      //   onError(new Error("Unknown error:" + error));
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
