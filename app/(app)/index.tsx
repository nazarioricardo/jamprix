import { Pressable, Text, View } from "react-native";
import { useSession } from "../../providers/useSession";

function Home() {
  const { signOut } = useSession();
  return (
    <View>
      <Text>Testing</Text>
      <Pressable onPress={signOut}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}

export default Home;
