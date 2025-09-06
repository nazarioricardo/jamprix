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
  const { userId } = useSession();
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (isFetching) {
  //       return;
  //     }

  //     if (!userId) {
  //       console.log("No user id");
  //       return;
  //     }

  //     setIsFetching(true);
  //     supabase
  //       .from("participants")
  //       .select(`*, channel (*, created_by(*))`)
  //       .eq("profile", userId)
  //       .then(({ data, error }) => {
  //         setIsFetching(false);
  //         if (error) {
  //           console.error("Error fetching participants:", error);
  //           return;
  //         }

  //         if (!data) {
  //           setChannels([]);
  //           return;
  //         }

  //         setChannels(data.map((partipant: Participant) => partipant.channel));
  //       });

  //     request()
  //       .get("/catalog/us/search", {
  //         params: {
  //           term: "the+beatles",
  //           types: "albums",
  //         },
  //       })
  //       .then((response) => {
  //         console.log("Found!", response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching catalog!", error);
  //       });
  //   }, [userId])
  // );

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
