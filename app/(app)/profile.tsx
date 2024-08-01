import { Button } from "react-native-ui-lib";
import { useRouter } from "expo-router";
import PageView from "../../components/PageView";
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
    <PageView>
      <Button label="Sign Out" onPress={onPressSignOut} />
    </PageView>
  );
}

export default Profile;
