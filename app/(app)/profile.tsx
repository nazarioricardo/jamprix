import { Button, View } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "@/providers/useSession";

function Profile() {
  const router = useRouter();
  const { signOut } = useSession();

  const onPressSignOut = () => {
    router.navigate("/");

    if (signOut) {
      signOut();
    }
  };

  return (
    <View>
      <Button title="Sign Out" onPress={onPressSignOut} />
    </View>
  );
}

export default Profile;
