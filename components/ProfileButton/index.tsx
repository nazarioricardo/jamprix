import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-ui-lib";
import { useSession } from "../../providers/useSession";

function ProfileButton() {
  const router = useRouter();
  const { email } = useSession();

  const onPress = () => {
    console.log("ProfileButton pressed");
    router.navigate("/profile");
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height: 24,
        width: 24,
        borderRadius: 50,
        backgroundColor: "red",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Text>{email ? email[0].toUpperCase() : "P"}</Text>
    </Pressable>
  );
}

export default ProfileButton;
