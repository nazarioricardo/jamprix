import { useCallback, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSession } from "../../../providers/useSession";
import { supabase } from "../../../supabase/initSupabase";
import { Channel, Participant } from "../../../constants";

function Home() {
  const router = useRouter();
  const { signOut, email, database } = useSession();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isFetching) {
        return;
      }

      if (!database?.id) {
        return;
      }

      setIsFetching(true);

      supabase
        .from("participants")
        .select("*, channel (*)")
        .eq("profile", database.id)
        .then(({ data, error }) => {
          setIsFetching(false);

          console.log(data, error);
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

  const onPressChannel = (id: string) => {
    router.navigate({ pathname: `channel/[id]`, params: { id } });
  };

  return (
    <View>
      <Text>{email}</Text>
      {channels.map(({ id, title, description }) => {
        return (
          <Pressable key={id} onPress={() => onPressChannel(id)}>
            <Text>{title}</Text>
            <Text>{description}</Text>
          </Pressable>
        );
      })}
      <Button title="Create Prix" onPress={onPressCreatePrix} />
      <Button
        title="Supabase Test"
        onPress={async () => {
          try {
            const themes = await supabase.from("theme").select("name");
            console.log(themes);
          } catch (error) {
            console.error(error);
          }
        }}
      />
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

export default Home;
