import { Button, Text, View } from "react-native";
import { useSession } from "../../providers/useSession";

function Home() {
  const { signOut } = useSession();
  return (
    <View>
      <Text>Testing</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

export default Home;
