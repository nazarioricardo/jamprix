import { type Track } from "@/types";
import { XStack, YStack, Image, Text } from "tamagui";

function Track({ name, artist, image, album }: Track) {
  return (
    <XStack gap={"$2.5"}>
      <Image
        style={{ width: 100, height: 100, borderRadius: 12 }}
        source={{ uri: image }}
      />
      <YStack flex={1} gap={"$2"}>
        <Text flexWrap="wrap" fontSize={"$4"} fontWeight={"bold"}>
          {name}
        </Text>
        <Text flexWrap="wrap" fontSize={"$3"} fontWeight={"bold"}>
          by {artist}
        </Text>
        <Text flexWrap="wrap" fontSize={"$2"}>
          {album}
        </Text>
      </YStack>
    </XStack>
  );
}

export default Track;
