import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import type { Participant, Profile, Channel, Event } from "../../../../types";
import { supabase } from "../../../../supabase/initSupabase";
import { useSession } from "../../../../providers/useSession";
import EventCard from "../../../../components/EventCard";

type ChannelSearchParams = {
  channelId: string;
  createdBy: string;
  createdById: string;
} & Omit<Channel, "created_by">;

function Channel() {
  const { channelId, title, description, createdBy } =
    useLocalSearchParams<ChannelSearchParams>();
  const { userId, email } = useSession();
  const [users, setUsers] = useState<Profile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

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

        console.log("events", data);

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
        <Text>{description}</Text>
        <Text>Created by {createdBy}</Text>
        <View>
          {users.map(({ user_id, email }) => {
            return (
              <View key={user_id}>
                <Text>{email}</Text>
              </View>
            );
          })}
          <FlatList
            data={events}
            keyExtractor={(event) => event.id}
            renderItem={({ item: { id, theme } }) => {
              return (
                <EventCard
                  key={id}
                  id={id}
                  title={theme.title}
                  description={theme.description}
                />
              );
            }}
          />
        </View>
      </View>
    </>
  );
}

export default Channel;
