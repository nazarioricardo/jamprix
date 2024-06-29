import { StyleSheet, View, Button } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SpotifySignIn from "../components/SpotifySignIn";
import AppleSignIn from "../components/AppleSignIn";
import { useSession } from "../providers/useSession";
import { supabase } from "../supabase/initSupabase";

function Login() {
  const { music, database, signOut } = useSession();
  console.log("sessions", music, database);

  const onSuccess = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AppleSignIn />
      <SpotifySignIn onSuccess={onSuccess} />
      {/* <Pressable> */}
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
      <Button title="Sign Out" onPress={signOut} />
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
