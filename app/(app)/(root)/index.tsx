import { useCallback, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { View } from "tamagui";
import { useRouter, useFocusEffect } from "expo-router";
import { useSession } from "@/providers/useSession";
import { Channel } from "@/components";
import { supabase } from "@/supabase/initSupabase";
import { Channel as ChannelType, Participant } from "@/types";
import { signOutAsync } from "expo-apple-authentication";
import { request } from "@/request";

function Home() {
  const router = useRouter();
  const { session } = useSession();
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isFetching) {
        return;
      }

      if (!session?.user.id) {
        return;
      }

      setIsFetching(true);

      supabase
        .from("participants")
        .select(`*, channel (*)`)
        .eq("user", session?.user.id)
        .then(({ data, error }) => {
          setIsFetching(false);

          if (error) {
            console.error("Error fetching channels:", error);
            return;
          }

          const channels = data.map((participant) => participant.channel);
          setChannels(channels);
        });
    }, [session?.user.id])
  );

  return (
    <View>
      <FlatList
        data={channels}
        style={{ padding: 24, height: "100%", overflow: "visible" }}
        keyExtractor={(channel) => channel.id}
        renderItem={({ item: channel }) => {
          return <Channel.Card {...channel} />;
        }}
      />
    </View>
  );
}

export default Home;
