import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "../../../providers/useSession";
import { supabase } from "../../../supabase/initSupabase";

function Home() {
  const router = useRouter();
  const { signOut, email } = useSession();

  const onPressCreatePrix = async () => {
    router.push("contest/create");
  };

  return (
    <View>
      <Text>{email}</Text>
      <Button title="Create Prix" onPress={onPressCreatePrix} />
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

export default Home;
