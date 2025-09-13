import { View } from "react-native";
import { Formik } from "formik";
import { Input, Button, TextArea, Text } from "tamagui";
import { router } from "expo-router";
import { supabase } from "@/supabase/initSupabase";
import { useSession } from "@/providers/useSession";
import { useState } from "react";

type ChannelFormValues = {
  title: string;
  description: string;
};

function ChannelCreate() {
  // TODO: FORM VALIDATION
  // TODO: Make atomic - create channel, create participants, create events
  const { session } = useSession();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createChannel = async (title: string, description: string) => {
    const { data, error } = await supabase
      .from("channels")
      .insert([
        {
          title,
          description,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error posting channel: ${error.message}`);
    }

    return data;
  };

  const createParticipant = async (channelId: string, userId: string) => {
    const { error } = await supabase.from("participants").insert([
      {
        channel: channelId,
        user: userId,
      },
    ]);

    if (error) {
      throw new Error(`Error adding creator as participant: ${error.message}`);
    }
  };

  const createEvents = async (channelId: string) => {
    const { data: themes } = await supabase
      .from("themes")
      .select()
      .order("random()")
      .limit(3);

    if (!themes || themes.length === 0) {
      throw new Error("Error fetching themes");
    }

    const events = themes.map((theme) => ({
      theme_id: theme.id,
      channel_id: channelId,
    }));

    const { error } = await supabase.from("events").insert(events);
    if (error) {
      throw new Error(`Error creating events: ${error}`);
    }
  };

  const onSubmitChannel = async ({ title, description }: ChannelFormValues) => {
    if (!session) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const channel = await createChannel(title, description);

      if (!channel) {
        throw new Error("Failed to create channel");
      }

      await createParticipant(channel.id, session.user.id);
      await createEvents(channel.id);

      router.canDismiss() ? router.dismiss() : router.navigate("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ title: "", description: "" }}
      onSubmit={onSubmitChannel}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View
          style={{
            padding: 24,
            paddingBottom: 48,
            height: "100%",
            justifyContent: "flex-start",
            gap: 12,
          }}
        >
          <Input
            onChangeText={handleChange("title")}
            onBlur={handleBlur("title")}
            value={values.title}
            placeholder="Title"
          />
          <TextArea
            onChangeText={handleChange("description")}
            onBlur={handleBlur("description")}
            value={values.description}
            placeholder="Description..."
          />
          <Button disabled={loading} onPress={() => handleSubmit()}>
            {loading ? "Creating..." : "Submit"}
          </Button>
          {errorMessage && <Text color={"red"}>{errorMessage}</Text>}
        </View>
      )}
    </Formik>
  );
}

export default ChannelCreate;
