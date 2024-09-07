import { StyleSheet, View, Button } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SpotifySignIn, AppleSignIn } from "@/components/SignIn";
import { supabase } from "@/supabase/initSupabase";

function Login() {
  const onSuccess = () => {
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.navigate("/");
    }
  };

  const onError = (error: Error) => {
    console.error(error);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AppleSignIn onSuccess={onSuccess} onError={onError} />
      <SpotifySignIn onSuccess={onSuccess} onError={onError} />
      <Button
        title="Supabase Test"
        onPress={async () => {
          try {
            const themes = await supabase.from("theme").select("name");
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
