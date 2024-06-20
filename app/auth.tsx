import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import SpotifySignIn from "../components/SpotifySignIn";
import AppleSignIn from "../components/AppleSignIn";

function Login() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AppleSignIn />
      <SpotifySignIn />
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
