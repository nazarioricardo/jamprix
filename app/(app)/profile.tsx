import { Button, View } from "react-native-ui-lib";
import { useRouter } from "expo-router";
import { useSession } from "../../providers/useSession";

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
      <Button label="Sign Out" onPress={onPressSignOut} />
    </View>
  );
}

export default Profile;
