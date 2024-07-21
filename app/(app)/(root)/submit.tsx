import { useCallback, useState } from "react";
import { Image } from "react-native";
import { Text } from "react-native-ui-lib";
import PageView from "../../../components/PageView";
import { spotifyRequest } from "../../../request";
import * as Clipboard from "expo-clipboard";
import { useSession } from "../../../providers/useSession";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "react-native-ui-lib";
import { supabase } from "../../../supabase/initSupabase";
import { Track } from "../../../constants";
import { parseTrack } from "../../../utils";

const TEST_TRACK =
  "https://open.spotify.com/track/0Sg3UL7f40ulmTh0Xwr6qY?si=e4307eae42ff4e84";

function Submit() {
  const { access_token, dbUserId } = useSession();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);

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
      const response = await spotifyRequest.get(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
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
          profile: dbUserId,
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
    <PageView>
      {isFetching ? <Text>Loading...</Text> : null}
      {isPosting ? <Text>Submitting...</Text> : null}
      {track ? (
        <>
          <Text>
            {track.name} by {track.artist}
          </Text>
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: track.image }}
          />
          <Text>{track.album}</Text>
        </>
      ) : null}
      <Button label="Paste Link" onPress={pasteSong} />
      <Button label="Submit" disabled={!track} onPress={onPressSubmit} />
      <Button label="Cancel" onPress={() => router.dismiss()} />
    </PageView>
  );
}

export default Submit;
