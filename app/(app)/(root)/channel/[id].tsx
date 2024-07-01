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
  const { id } = useLocalSearchParams();
  const { email, database } = useSession();
  const [users, setUsers] = useState<Profile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    console.log("Channel id", id);
    if (!id || !database) {
      return;
    }

    supabase
      .from("participants")
      .select("*, profile (*)")
      .eq("channel", id)
      // .neq("profile", database.id)
      .then(({ data }) => {
        console.log("Data", data);
        if (!data) {
          setUsers([]);
          return;
        }

        setUsers(
          data.map((partipant: Participant) => {
            return partipant.profile;
          }),
        );
      });

    supabase
      .from("events")
      .select("*, theme (*)")
      .eq("channel", id)
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
      {users.map((user) => {
        return (
          <View key={user.id}>
            <Text>{user.email}</Text>
          </View>
        );
      })}

      {events.map((event) => {
        return (
          <View>
            <Text>{event.theme.title}</Text>
            <Text>{event.theme.title}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default Channel;
