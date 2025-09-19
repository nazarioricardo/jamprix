import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "tamagui";
import type { Profile, Channel, Event as EventType } from "@/types";
import { supabase } from "@/supabase/initSupabase";
import { useSession } from "@/providers/useSession";
import { Event } from "@/components";
import CardsList from "@/components/CardsList";

type ChannelSearchParams = {
  channelId: string;
  createdBy: string;
  createdById: string;
} & Omit<Channel, "created_by">;

type ParticipantsResponse = {
  channel_id: number;
  created_at: string;
  id: number;
  profile: Profile;
  user_id: string;
};

function Channel() {
  const { channelId, title, description } =
    useLocalSearchParams<ChannelSearchParams>();
  const { session } = useSession();
  const [participantProfiles, setParticipantProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);

  const fetchParticipants = async () => {
    if (!channelId || !session?.user.id) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("participants")
        .select("*, profile:profiles (*)")
        .eq("channel_id", channelId);

      if (error) {
        throw error;
      }

      if (!data) {
        setParticipantProfiles([]);
        return;
      }

      const participantsResponse: ParticipantsResponse[] = data;

      setParticipantProfiles(
        participantsResponse.map((partipant: ParticipantsResponse) => {
          return partipant.profile;
        })
        // .filter(({ user_id }) => user_id === session.user.id)
      );
    } catch (error) {
      console.error("Error fetching participants", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*, theme:themes (*)")
        .eq("channel_id", channelId);

      if (error) {
        console.error(error);
        throw error;
      }

      if (!data) {
        setEvents([]);
        return;
      }

      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchEvents();
  }, []);

  console.log("participantProfiles", participantProfiles);

  return (
    <>
      <Stack.Screen options={{ title: title }} />
      <View>
        {participantProfiles && (
          <FlatList
            data={participantProfiles}
            keyExtractor={(participantProfiles) => participantProfiles.user_id}
            renderItem={({ item: { display_name } }) => {
              return <Text>{display_name}</Text>;
            }}
          />
        )}

        <CardsList data={events} Card={Event.Card} />
      </View>
    </>
  );
}

export default Channel;
