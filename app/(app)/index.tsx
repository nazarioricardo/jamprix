import { Button, Text, View } from "react-native";
import { useSession } from "../../providers/useSession";
// import { supabase } from "../../supabase/initSupabase";
import { useRouter } from "expo-router";

function Home() {
  const router = useRouter();
  const { signOut, email } = useSession();
  const onPressCreatePrix = async () => {
    router.push("contest/create");

    // try {
    //   const response = await supabase.from("contest").insert({ name: "Prix" });
    //   console.log(response);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <View>
      <Text>{email}</Text>
      <Button title="Create Prix" onPress={onPressCreatePrix} />
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

export default Home;
