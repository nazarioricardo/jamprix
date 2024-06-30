import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "../../../providers/useSession";
import { supabase } from "../../../supabase/initSupabase";

type Channel = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

type Participant = {
  user: string;
  channel: Channel;
};

function Home() {
  const router = useRouter();
  const { signOut, email, database } = useSession();
  const [channels, setChannels] = useState<Channel[]>([]);
  useEffect(() => {
    supabase
      .from("participants")
      .select("*, channel (*)")
      .eq("user", database?.id)
      .then(({ data }) => {
        console.log(data);
        if (!data) {
          setChannels([]);
          return;
        }

        setChannels(data.map((partipant: Participant) => partipant.channel));
      });
  }, []);

  const onPressCreatePrix = async () => {
    router.push("contest/create");
  };

  return (
    <View>
      <Text>{email}</Text>
      {channels.map(({ id, title, description }) => {
        return (
          <View key={id}>
            <Text>{title}</Text>
            <Text>{description}</Text>
          </View>
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
