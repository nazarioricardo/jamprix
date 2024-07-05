import { Text, View } from "react-native";
import {
  Participant,
  type Profile,
  type Channel,
  type Event,
} from "../../../../constants";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/initSupabase";
import { useSession } from "../../../../providers/useSession";
import { useLocalSearchParams } from "expo-router";

function Channel() {
  const { channelId } = useLocalSearchParams();
  const { userId } = useSession();
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
      // .neq("profile", supabaseUserId)
      .then(({ data }) => {
        if (!data) {
          setUsers([]);
          return;
        }

        setUsers(
          data.map((partipant: Participant) => {
            return partipant.profile;
          })
        );
      });

    supabase
      .from("events")
      .select("*, theme (*)")
      .eq("channel", channelId)
      .then(({ data }) => {
        if (!data) {
          setEvents([]);
          return;
        }

        setEvents(data);
      });
  }, []);

  return (
    <View>
      {users.map(({ user_id, email }) => {
        return (
          <View key={user_id}>
            <Text>{email}</Text>
          </View>
        );
      })}

      {events.map(({ id, theme }) => {
        return (
          <View key={id}>
            <Text>{theme.title}</Text>
            <Text>{theme.description}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default Channel;
