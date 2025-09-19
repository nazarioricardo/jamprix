import { useEffect, useState } from "react";
import { View } from "react-native";
import { Card, Paragraph } from "tamagui";
import { Stack, useLocalSearchParams } from "expo-router";
import { Track as SpotifyTrack } from "spotify-types";
import type { Profile, Submission, Track as TrackType } from "@/types";
import { supabase } from "@/supabase/initSupabase";
import { request } from "@/request";
import { useSession } from "@/providers/useSession";
import { parseTrack } from "@/utils";
import { Track } from "@/components";
import CardsList from "@/components/CardsList";

type EventParams = {
  id: string;
  title: string;
  description: string;
  submissions: string;
  userTrack: string;
};

type SubmissionListItem = Submission & {
  profile: Profile;
  track: TrackType;
};

function Event() {
  const { signOut } = useSession();
  const { id, title, description, userTrack } =
    useLocalSearchParams<EventParams>();

  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*, profile:profiles (*)")
        .eq("event_id", id);

      if (error) {
        throw error;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("Session not found!");
        throw new Error("Session not found!");
      }

      const spotifyIds = data
        .filter((submission) => submission.profile.user_id !== session.user.id)
        .map((submission) => {
          console.log(submission.profile.user_id === session.user.id);
          return submission.spotify_id;
        });

      if (spotifyIds.length === 0) {
        return;
      }

      const url = `https://api.spotify.com/v1/tracks?ids=${spotifyIds.join(
        ","
      )}`;

      const {
        data: { tracks },
      } = await request().get(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const trackMap = tracks.reduce(
        (acc: { [key: string]: SpotifyTrack }, track: SpotifyTrack) => {
          acc[track.id] = track;
          return acc;
        },
        {}
      );

      const combined = data
        .map((submission) => {
          if (!submission.spotify_id) {
            return;
          }

          return {
            ...submission,
            track: parseTrack(trackMap[submission.spotify_id]),
          };
        })
        .filter((submission) => submission !== null);

      setSubmissions(combined);
    } catch (error) {
      console.error("Error fetching submissions", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  let userSubmissionTrack: TrackType | undefined;
  if (userTrack) {
    const parsedTrack = JSON.parse(userTrack) as TrackType;
    userSubmissionTrack = parsedTrack;
  }

  return (
    <>
      <Stack.Screen options={{ title: title }} />
      <View>
        <Card padded elevate>
          <Card.Header>
            <Paragraph fontSize={"$6"}>{description}</Paragraph>
          </Card.Header>
        </Card>
        <Track.Select
          eventId={id!}
          track={userSubmissionTrack}
          isFetching={false}
        />

        <CardsList data={submissions} Card={Track.Info} />
      </View>
    </>
  );
}

export default Event;
