import { FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native-ui-lib";
import PageView from "../../../../components/PageView";
import { Profile, Submission, Track } from "../../../../constants";
import { supabase } from "../../../../supabase/initSupabase";
import { useEffect, useState } from "react";
import { spotifyRequest } from "../../../../request";
import { useSession } from "../../../../providers/useSession";
import { Track as SpotifyTrack } from "spotify-types";
import { parseTrack } from "../../../../utils";

type EventParams = {
  id: string;
  title: string;
  description: string;
};

type SubmissionListItem = Submission & {
  profile: Profile;
  track: Track;
};

function Event() {
  const { access_token } = useSession();
  const { id, title, description } = useLocalSearchParams<EventParams>();

  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*, profile (*)")
        .eq("event", id);

      if (error) {
        throw error;
      }

      const spotifyIds = data.map((submission) => submission.spotify_id);
      const url = `https://api.spotify.com/v1/tracks?ids=${spotifyIds.join(
        ","
      )}`;
      const {
        data: { tracks },
      } = await spotifyRequest.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const trackMap = tracks.reduce(
        (acc: { [key: string]: SpotifyTrack }, track: SpotifyTrack) => {
          acc[track.id] = track;
          return acc;
        },
        {}
      );

      const combined = data.map((submission) => {
        return {
          ...submission,
          track: parseTrack(trackMap[submission.spotify_id]),
        };
      });

      setSubmissions(combined);
    } catch (error) {
      console.error("Error fetching submissions", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: title }} />
      <PageView>
        <Text>{description}</Text>
        <FlatList
          data={submissions}
          keyExtractor={(submission) => submission.profile.user_id}
          renderItem={({ item: { profile, track } }) => {
            return (
              <View>
                <Text>{profile.email}</Text>
                <Text>{track.name}</Text>
                <Text>{track.artist}</Text>
                <Text>{track.album}</Text>
              </View>
            );
          }}
        />
      </PageView>
    </>
  );
}

export default Event;
