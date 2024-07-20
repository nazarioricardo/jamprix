import { useCallback, useEffect, useMemo, useState } from "react";
import { TextInput, Image } from "react-native";
import { Text } from "react-native-ui-lib";
import PageView from "../../../components/PageView";
import { spotifyRequest } from "../../../request";
import * as Clipboard from "expo-clipboard";
import { useSession } from "../../../providers/useSession";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-ui-lib";
import { supabase } from "../../../supabase/initSupabase";

type Track = {
  id: string;
  artist: string;
  album: string;
  name: string;
  href: string;
  uri: string;
  preview_url: string;
  image: string;
};

const TEST =
  "https://open.spotify.com/track/0Sg3UL7f40ulmTh0Xwr6qY?si=e4307eae42ff4e84";

function Submit() {
  const { access_token } = useSession();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
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

      setTrack({
        id: response.data.id,
        artist: response.data.artists[0].name,
        album: response.data.album.name,
        name: response.data.name,
        href: response.data.external_urls.spotify,
        uri: response.data.uri,
        preview_url: response.data.preview_url,
        image: response.data.album.images[0].url,
      });
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
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!user) {
        setIsPosting(false);
        throw new Error("No user found");
      }

      const response = await supabase.from("submissions").upsert(
        {
          spotify_id: track.id,
          profile: user.id,
          event: eventId,
        },
        { onConflict: "event, profile" }
      );

      if (response.error) {
        setIsPosting(false);
        throw response.error;
      }
    } catch (error) {
      console.error(error);
    }

    setIsPosting(false);
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
    </PageView>
  );
}

export default Submit;
