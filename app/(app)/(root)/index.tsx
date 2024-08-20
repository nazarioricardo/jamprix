import { useCallback, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View } from "tamagui";
import { useRouter, useFocusEffect } from "expo-router";
import { useSession } from "@/providers/useSession";
import { Channel } from "@/components";
import { supabase } from "@/supabase/initSupabase";
import { Channel as ChannelType, Participant } from "@/types";

function Home() {
  const router = useRouter();
  const { dbUserId } = useSession();
  const [channels, setChannels] = useState<ChannelType[]>([]);
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

  const onPressChannel = (channel: ChannelType) => {
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
        style={{ padding: 24, height: "100%", overflow: "visible" }}
        keyExtractor={(channel) => channel.id}
        renderItem={({ item: channel }) => {
          return (
            <TouchableOpacity onPress={() => onPressChannel(channel)}>
              <Channel.Card {...channel} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default Home;
