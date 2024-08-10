import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "@/providers/useSession";

function ProfileButton() {
  const router = useRouter();
  const { email } = useSession();

  const onPress = () => {
    console.log("ProfileButton pressed");
    router.navigate("/profile");
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 24,
        width: 24,
        borderRadius: 50,
        backgroundColor: "red",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{email ? email[0].toUpperCase() : "P"}</Text>
    </TouchableOpacity>
  );
}

export default ProfileButton;
