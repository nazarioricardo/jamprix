import { Image, Text, View } from "react-native";
import { type Track } from "../../constants";

function Track({ name, artist, image, album }: Track) {
  return (
    <View>
      <Text>
        {name} by {artist}
      </Text>
      <Image style={{ width: 200, height: 200 }} source={{ uri: image }} />
      <Text>{album}</Text>
    </View>
  );
}

export default Track;
