import { TouchableOpacity } from "react-native";
import { Card, useTheme, Text, Spinner, View } from "tamagui";
import { type Track } from "@/types";
import TrackInfo from "./TrackInfo";
import { useRouter } from "expo-router";

type TrackSelectProps = { track?: Track; eventId: string; isFetching: boolean };

function TrackSelect({ track, eventId, isFetching }: TrackSelectProps) {
  const router = useRouter();
  const theme = useTheme();

  const onPress = () => {
    router.navigate({
      pathname: "submit",
      params: { eventId, currentTrack: JSON.stringify(track) },
    });
  };

  return (
    <Card backgroundColor={theme.color4} style={{ height: 100, width: "100%" }}>
      <TouchableOpacity
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onPress}
      >
        {isFetching && <Spinner />}

        {!isFetching && track && (
          <TrackInfo
            name={track.name}
            artist={track.artist}
            image={track.image}
            album={track.album}
          />
        )}

        {!isFetching && !track && <Text>+ Add A Track</Text>}
      </TouchableOpacity>
    </Card>
  );
}

export default TrackSelect;
