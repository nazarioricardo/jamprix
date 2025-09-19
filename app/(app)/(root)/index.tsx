import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { View } from "tamagui";
import { useFocusEffect } from "expo-router";
import { useSession } from "@/providers/useSession";
import { Channel } from "@/components";
import { supabase } from "@/supabase/initSupabase";
import { type Channel as ChannelType } from "@/types";
import CardsList from "@/components/CardsList";

function Home() {
  const { session } = useSession();
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchChannels = async () => {
        if (isFetching) {
          return;
        }

        if (!session?.user.id) {
          return;
        }

        setIsFetching(true);

        try {
          const { data, error } = await supabase
            .from("participants")
            .select(
              `
              *, 
              channels (*, created_by:profiles (*))
              `
            )
            .eq("user_id", session?.user.id);

          setIsFetching(false);

          if (error) {
            throw error;
          }

          if (!data) {
            setChannels([]);
          }

          const fetchedChannels = data.map(
            (participant) => participant.channels
          );

          setChannels(fetchedChannels);
        } catch (error) {
          console.error("Error fetching channels:", error);
        }
      };

      fetchChannels();
    }, [session?.user.id])
  );

  return (
    <View>
      <CardsList data={channels} Card={Channel.Card} />
    </View>
  );
}

export default Home;
