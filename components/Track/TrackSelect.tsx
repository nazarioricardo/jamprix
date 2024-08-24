import { TouchableOpacity } from "react-native";
import { Card, useTheme, Text } from "tamagui";
import { type Track } from "@/types";
import TrackInfo from "./TrackInfo";
import { useRouter } from "expo-router";

type TrackSelectProps = { track?: Track; eventId: string };

function TrackSelect({ track, eventId }: TrackSelectProps) {
  const router = useRouter();
  const theme = useTheme();

  const onPress = () => {
    router.navigate({
      pathname: "submit",
      params: { eventId },
    });
  };

  return (
    <Card backgroundColor={theme.color4} onPress={() => console.log("pressed")}>
      <TouchableOpacity onPress={onPress}>
        {track ? (
          <TrackInfo
            name={track.name}
            artist={track.artist}
            image={track.image}
            album={track.album}
          />
        ) : (
          <Text>Add A Track</Text>
        )}
      </TouchableOpacity>
    </Card>
  );
}

export default TrackSelect;
