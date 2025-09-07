import { useCallback, useState } from "react";
import { Text, View, Button } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { request } from "@/request";
import { useSession } from "@/providers/useSession";
import { supabase } from "@/supabase/initSupabase";
import type { Track as TrackType } from "@/types";
import { parseTrack } from "@/utils";
import Track from "@/components/Track";

// const TEST_TRACK =
//   "https://open.spotify.com/track/0Sg3UL7f40ulmTh0Xwr6qY?si=e4307eae42ff4e84";

type SubmitParams = {
  eventId: string;
  currentTrack?: string;
};

function Submit() {
  const { eventId, currentTrack } = useLocalSearchParams<SubmitParams>();
  const { session } = useSession();

  if (!session) {
    // TODO: Create better way to handle no session
    return <></>;
  }

  const parsedCurrentTrack: TrackType = currentTrack
    ? JSON.parse(currentTrack)
    : null;

  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [track, setTrack] = useState<TrackType | null>(parsedCurrentTrack);

  const fetchTrack = async (uri: string) => {
    if (uri === "") {
      return;
    }

    const trackIdMatch = uri.match(/track\/([a-zA-Z0-9]+)(?:\?|$)/);
    if (!trackIdMatch) {
      console.error("Invalid Spotify link");
      return;
    }

    setIsFetching(true);

    const trackId = trackIdMatch[1];

    try {
      const response = await request().get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      setTrack(parseTrack(response.data));
    } catch (error) {
      console.error(error);
    }

    setIsFetching(false);
  };

  const pasteSong = async () =>
    await Clipboard.getStringAsync().then((content) => {
      fetchTrack(content);
    });

  useFocusEffect(
    useCallback(() => {
      pasteSong();
    }, [])
  );

  const onPressSubmit = async () => {
    if (!track) {
      return;
    }

    setIsPosting(true);

    try {
      const { error } = await supabase.from("submissions").upsert(
        {
          spotify_id: track.id,
          profile: session.user.id,
          event: eventId,
        },
        { onConflict: "event, profile" }
      );

      if (error) {
        setIsPosting(false);
        throw error;
      }
    } catch (error) {
      console.error(error);
    }

    router.dismiss();
  };

  return (
    <View>
      {isFetching ? <Text>Loading...</Text> : null}
      {isPosting ? <Text>Submitting...</Text> : null}
      {track && <Track.Info {...track} />}
      <Button title="Paste Link" onPress={pasteSong} />
      <Button title="Submit" disabled={!track} onPress={onPressSubmit} />
      <Button title="Cancel" onPress={() => router.dismiss()} />
    </View>
  );
}

export default Submit;
