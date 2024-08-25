import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { Card, Button, YStack } from "tamagui";
import { supabase } from "@/supabase/initSupabase";
import type { Submission, Event, Track as TrackType } from "@/types";
import { useSession } from "@/providers/useSession";
import { parseTrack } from "@/utils";
import Track from "../Track/index";
import EventInfo from "./EventInfo";

function EventCard({ id, theme }: Event) {
  const { title, description } = theme;
  const router = useRouter();
  const { dbUserId, access_token } = useSession();

  const [isFetching, setIsFetching] = useState(true);
  const [userTrack, setUserTrack] = useState<TrackType | undefined>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

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
    setIsFetching(true);
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${spotifyId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    setUserTrack(parseTrack(response.data));
    setIsFetching(false);
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
    <Card padded elevate>
      <Card.Header>
        <EventInfo id={id} theme={theme} submissions={submissions} />
      </Card.Header>

      <YStack gap="$4">
        <Track.Select track={userTrack} eventId={id} isFetching={isFetching} />
        <Button onPress={onPressViewEvent}>View Event</Button>
      </YStack>
    </Card>
  );
}

export default EventCard;
