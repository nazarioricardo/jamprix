import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-ui-lib";

function CreateChannelButton() {
  const router = useRouter();

  const onPress = () => {
    console.log("CreateChannelButton pressed");
    router.navigate("/channel/create");
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
      <Text>+</Text>
    </Pressable>
  );
}

export default CreateChannelButton;
