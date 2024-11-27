import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "tamagui";
import type {
  Participant,
  Profile,
  Channel,
  Event as EventType,
} from "@/types";
import { supabase } from "@/supabase/initSupabase";
import { useSession } from "@/providers/useSession";
import { Event } from "@/components";

type ChannelSearchParams = {
  channelId: string;
  createdBy: string;
  createdById: string;
} & Omit<Channel, "created_by">;

function Channel() {
  const { channelId, title, description } =
    useLocalSearchParams<ChannelSearchParams>();
  const { userId } = useSession();
  const [users, setUsers] = useState<Profile[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    if (!channelId || !userId) {
      return;
    }

    supabase
      .from("participants")
      .select("*, profile (*)")
      .eq("channel", channelId)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          throw error;
        }

        if (!data) {
          setUsers([]);
          return;
        }

        setUsers(
          data
            .map((partipant: Participant) => {
              return partipant.profile;
            })
            .filter(({ user_id }) => user_id === userId),
        );
      });

    supabase
      .from("events")
      .select("*, theme (*)")
      .eq("channel", channelId)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          throw error;
        }

        if (!data) {
          setEvents([]);
          return;
        }

        setEvents(data);
      });
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: title }} />
      <View>
        <FlatList
          data={events}
          keyExtractor={(event) => event.id}
          style={{ padding: 24, height: "100%", overflow: "visible" }}
          renderItem={({ item: { id, theme } }) => {
            return <Event.Card key={id} id={id} theme={theme} />;
          }}
        />
      </View>
    </>
  );
}

export default Channel;
