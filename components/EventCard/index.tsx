import { useEffect, useState } from "react";
import { Text, Button, View } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { supabase } from "../../supabase/initSupabase";
import Track from "../Track";
import type { Submission, Track as TrackType } from "../../constants";
import { useSession } from "../../providers/useSession";
import { parseTrack } from "../../utils";

type EventCardProps = {
  id: string;
  title: string;
  description: string;
};

function EventCard({ id, title, description }: EventCardProps) {
  const router = useRouter();
  const { dbUserId, access_token } = useSession();

  const [userTrack, setUserTrack] = useState<TrackType | undefined>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const onPressFindYourSong = () => {
    router.navigate({
      pathname: "submit",
      params: { eventId: id },
    });
  };

  const onPressViewEvent = () => {
    router.push({
      pathname: "event/[eventId]",
      params: {
        id,
        title,
        description,
        submissions: JSON.stringify(submissions),
      },
    });
  };

  const fetchUserSubmission = async (spotifyId: string) => {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${spotifyId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    setUserTrack(parseTrack(response.data));
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("event", id);

      if (error) {
        throw error;
      }

      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const userSubmission = submissions.find(
      (submission) => submission.profile === dbUserId,
    );

    if (userSubmission && userSubmission.spotify_id) {
      fetchUserSubmission(userSubmission.spotify_id);
    }
  }, [submissions]);

  return (
    <View style={{ padding: 16 }}>
      <Text>{title}</Text>
      <Text>{description}</Text>

      {userTrack ? (
        <>
          <Track {...userTrack} />
          <Button title="Change Your Song" onPress={onPressFindYourSong} />
        </>
      ) : (
        <Button title="Add Your Song" onPress={onPressFindYourSong} />
      )}

      <Text>{submissions.length} total submissions</Text>
      <Button title="View Event" onPress={onPressViewEvent} />
    </View>
  );
}

export default EventCard;
