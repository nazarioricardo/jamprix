import { type Track } from "@/types";
import { XStack, YStack, Image, Text } from "tamagui";

type TrackProps = Omit<Track, "id" | "href" | "preview_url" | "uri"> & {
  user?: string;
};

function TrackInfo({ name, artist, image, album }: TrackProps) {
  return (
    <XStack gap={"$2.5"}>
      <Image
        style={{ width: 100, height: 100, borderRadius: 10 }}
        source={{ uri: image }}
      />
      <YStack flex={1} gap={"$2"} justifyContent="center">
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

export default TrackInfo;
