import { useCallback, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSession } from "../../../providers/useSession";
import { supabase } from "../../../supabase/initSupabase";
import { Channel, Participant } from "../../../constants";

function Home() {
  const router = useRouter();
  const { signOut, email } = useSession();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isFetching) {
        return;
      }

      setIsFetching(true);

      supabase.auth
        .getUser()
        .then(({ data, error }) => {
          if (error) {
            throw error;
          }

          if (!data) {
            throw new Error("No user found");
          }

          const { user } = data;
          return supabase
            .from("participants")
            .select("*, channel (*)")
            .eq("profile", user.id);
        })

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
        })
        .catch((error) => {
          setChannels([]);
          console.error(error);
        });
    }, [])
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
          console.log("Supabase Test");
          try {
            const themes = await supabase.from("themes").select("name");
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
