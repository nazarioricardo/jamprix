import { StyleSheet, View, Button } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SpotifySignIn from "@/components/SpotifySignIn";
import AppleSignIn from "@/components/AppleSignIn";
import { supabase } from "@/supabase/initSupabase";

function Login() {
  const onSuccess = () => {
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.navigate("/");
    }
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "90%",
    height: 64,
  },
});

export default Login;
