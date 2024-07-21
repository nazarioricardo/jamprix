import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { Button, Card, Text } from "react-native-ui-lib";
import { useRouter, useFocusEffect } from "expo-router";
import { useSession } from "../../../providers/useSession";
import { supabase } from "../../../supabase/initSupabase";
import { Channel, Participant } from "../../../constants";
import PageView from "../../../components/PageView";

function Home() {
  const router = useRouter();
  const { signOut, dbUserId } = useSession();
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
    }, [])
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
    <PageView>
      <Button label="Create a Channel" onPress={onPressCreatePrix} />

      <FlatList
        data={channels}
        keyExtractor={(channel) => channel.id}
        renderItem={({ item: channel }) => {
          return (
            <Card
              onPress={() => onPressChannel(channel)}
              containerStyle={{ padding: 16 }}
            >
              <Text text60BO>{channel.title}</Text>
              <Text text80>{channel.description}</Text>
              <Text text100L>by {channel.created_by.email}</Text>
            </Card>
          );
        }}
      />

      <Button label="Sign Out" onPress={signOut} />
    </PageView>
  );
}

export default Home;
