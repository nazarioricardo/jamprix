import { useRouter } from "expo-router";
import { Card, Text, Button } from "react-native-ui-lib";

type EventCardProps = {
  id: string;
  title: string;
  description: string;
};

function EventCard({ id, title, description }: EventCardProps) {
  const router = useRouter();

  const onPressFindYourSong = () => {
    router.navigate({
      pathname: "submit",
      params: { eventId: id },
    });
  };

  return (
    <Card containerStyle={{ padding: 16 }}>
      <Text text60BO>{title}</Text>
      <Text text80>{description}</Text>
      <Button label="Find Your Song" onPress={onPressFindYourSong} />
    </Card>
  );
}

export default EventCard;
