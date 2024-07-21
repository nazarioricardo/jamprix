import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Card, Text, Button } from "react-native-ui-lib";
import { supabase } from "../../supabase/initSupabase";
import { Submission } from "../../constants";

type EventCardProps = {
  id: string;
  title: string;
  description: string;
};

function EventCard({ id, title, description }: EventCardProps) {
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const onPressFindYourSong = () => {
    router.navigate({
      pathname: "submit",
      params: { eventId: id },
    });
  };

  const getSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("event", id);

      if (error) {
        throw error;
      }

      if (data) {
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions", error);
    }
  };

  const parseSubmissions = () => {};

  useEffect(() => {
    getSubmissions();
  }, []);

  return (
    <Card containerStyle={{ padding: 16 }}>
      <Text text60BO>{title}</Text>
      <Text text80>{description}</Text>

      <Button label="Add Your Song" onPress={onPressFindYourSong} />
    </Card>
  );
}

export default EventCard;
