import { Button, View, Text, YStack, useTheme } from "tamagui";
import { useRouter } from "expo-router";
import { useSession } from "@/providers/useSession";

function Profile() {
  const theme = useTheme();
  const router = useRouter();
  const { signOut, displayName, provider } = useSession();

  const onPressSignOut = () => {
    router.navigate("/");

    if (signOut) {
      signOut();
    }
  };

  const onPressDismiss = () => {
    router.dismiss();
  };

  return (
    <View>
      <YStack
        style={{
          padding: 24,
          paddingBottom: 48,
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <YStack>
          <Text>{provider}</Text>
          <Text>{displayName}</Text>
        </YStack>
        <Button backgroundColor={"$color6"} onPress={onPressSignOut}>
          Sign Out
        </Button>
        <Button backgroundColor={"$color6"} onPress={onPressDismiss}>
          Dismiss
        </Button>
      </YStack>
    </View>
  );
}

export default Profile;
