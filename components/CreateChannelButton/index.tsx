import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

function CreateChannelButton() {
  const router = useRouter();

  const onPress = () => {
    console.log("CreateChannelButton pressed");
    router.navigate("/channel/create");
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
      <Text>+</Text>
    </TouchableOpacity>
  );
}

export default CreateChannelButton;
