import { Button, Pressable, StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import SpotifySignIn from "../components/SpotifySignIn";
import AppleSignIn from "../components/AppleSignIn";
import { supabase } from "../supabase/initSupabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import axios from "axios";

function Login() {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AUTH", event, session);
      },
    );
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AppleSignIn />
      <SpotifySignIn />
      <Button
        title="Spotify Test"
        onPress={async () => {
          try {
            const response = await axios.get("https://api.spotify.com/v1/me");
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
        }}
      />

      <Button
        title="Supabase Test"
        onPress={async () => {
          try {
            const response = await axios.post(
              "http://localhost:8000/auth/token",
              { code: "CODE", redirect_uri: "test" },
            );
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
          // try {
          //   const themes = await supabase.from("theme").select("name");
          //   console.log(themes);
          // } catch (error) {
          //   console.error(error);
          // }
        }}
      />
      <Button
        title="Supabase Login"
        onPress={async () => {
          const {
            data: { url },
            error,
          } = await supabase.auth.signInWithOAuth({
            provider: "spotify",
            options: {
              redirectTo:
                "https://igtffjmchiunpkequfqc.supabase.co/auth/v1/callback",
            },
          });

          console.log("RES", url);
          if (url) {
            // await WebBrowser.openBrowserAsync(url);
            const data = await WebBrowser.openAuthSessionAsync(
              url,
              // makeRedirectUri({
              //   native: "dev.gneiss.JamPrix://",
              // }),
            );
            console.log(data);
          }
        }}
      />
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

export default Login;
