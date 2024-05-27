import { Button, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import SpotifySignIn from "../components/SpotifySignIn";
import AppleSignIn from "../components/AppleSignIn";
import { request } from "../request";
import { supabase } from "../supabase/initSupabase";

function Login() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AppleSignIn />
      <SpotifySignIn />
      <Button
        title="Spotify Test"
        onPress={async () => {
          try {
            const response = await request.get("https://api.spotify.com/v1/me");
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
            const themes = await supabase.from("theme").select("name");
            console.log(themes);
          } catch (error) {
            console.error(error);
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
