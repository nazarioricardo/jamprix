import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Card } from "tamagui";
import { useSession } from "@/providers/useSession";
import { supabase } from "@/supabase/initSupabase";
import { Channel, Participant } from "@/types";

function Home() {
  const router = useRouter();
  const { dbUserId } = useSession();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isFetching) {
        return;
      }

      setIsFetching(true);

      supabase
        .from("participants")
        .select(`*, channel (*, created_by(*))`)
        .eq("profile", dbUserId)
        .then(({ data, error }) => {
          setIsFetching(false);
          if (error) {
            throw error;
          }

          if (!data) {
            setChannels([]);
            return;
          }

          setChannels(data.map((partipant: Participant) => partipant.channel));
        });
    }, []),
  );

  const onPressCreatePrix = async () => {
    router.navigate("channel/create");
  };

  const onPressChannel = (channel: Channel) => {
    const { created_by, ...rest } = channel;
    router.navigate({
      pathname: `channel/[id]`,
      params: {
        ...rest,
        createdBy: created_by.email,
        createdById: created_by.user_id,
      },
    });
  };

  return (
    <View>
      <FlatList
        data={channels}
        keyExtractor={(channel) => channel.id}
        renderItem={({ item: channel }) => {
          return (
            <Card>
              <TouchableOpacity
                onPress={() => onPressChannel(channel)}
                style={{ padding: 16 }}
              >
                <Text>{channel.title}</Text>
                <Text>{channel.description}</Text>
                <Text>by {channel.created_by.email}</Text>
              </TouchableOpacity>
            </Card>
          );
        }}
      />
    </View>
  );
}

export default Home;
