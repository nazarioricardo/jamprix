import { type Track } from "@/types";
import { Card, useTheme } from "tamagui";
import TrackInfo from "./TrackInfo";

type TrackSelectProps = Track;

function TrackSelect({ name, artist, image, album }: TrackSelectProps) {
  const theme = useTheme();
  return (
    <Card backgroundColor={theme.color4}>
      <TrackInfo name={name} artist={artist} image={image} album={album} />
    </Card>
  );
}

export default TrackSelect;
