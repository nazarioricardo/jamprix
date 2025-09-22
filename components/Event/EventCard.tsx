import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Card, Button, YStack } from "tamagui";
import { supabase } from "@/supabase/initSupabase";
import type { Submission, Event, Track as TrackType } from "@/types";
import { useSession } from "@/providers/useSession";
import { parseTrack } from "@/utils";
import Track from "../Track/index";
import EventInfo from "./EventInfo";
import { request } from "@/request";

function EventCard({ id, theme, status }: Event) {
  const { title, description } = theme;
  const router = useRouter();
  const { session } = useSession();

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
        userTrack: JSON.stringify(userTrack),
        submissions: JSON.stringify(submissions),
      },
    });
  };

  const fetchUserSubmission = async (spotifyId: string) => {
    if (!session) {
      return;
    }

    setIsFetching(true);

    try {
      const response = await request().get(
        `https://api.spotify.com/v1/tracks/${spotifyId}`
      );

      setUserTrack(parseTrack(response.data));
    } catch (error) {
      console.error(
        "Error fetching submissions",
        JSON.stringify(error, null, 2)
      );
    } finally {
      setIsFetching(false);
    }
  };

  const fetchSubmissions = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("event_id", id);

      if (error) {
        throw error;
      }

      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    const userSubmission = submissions.find(
      (submission) => submission.user_id === session.user.id
    );

    if (userSubmission && userSubmission.spotify_id) {
      fetchUserSubmission(userSubmission.spotify_id);
    }
  }, [submissions]);

  return (
    <Card padded elevate>
      <Card.Header>
        <EventInfo
          id={id}
          theme={theme}
          submissions={submissions}
          status={status}
        />
      </Card.Header>

      <YStack gap="$4">
        <Track.Select track={userTrack} eventId={id} isFetching={isFetching} />
        <Button onPress={onPressViewEvent}>View Event</Button>
      </YStack>
    </Card>
  );
}

export default EventCard;
