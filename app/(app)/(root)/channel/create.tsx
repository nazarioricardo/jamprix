import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import { Input, Button, TextArea } from "tamagui";
import { router } from "expo-router";
import { supabase } from "@/supabase/initSupabase";
import { useSession } from "@/providers/useSession";

type ChannelFormValues = {
  title: string;
  description: string;
};

function ChannelCreate() {
  const { session } = useSession();

  const onSubmitChannel = async ({ title, description }: ChannelFormValues) => {
    if (!session) {
      return;
    }

    const { data: channelData, error: channelError } = await supabase
      .from("channels")
      .insert([
        {
          title,
          description,
        },
      ])
      .select()
      .single();

    console.log("data", channelData);
    if (channelError) {
      console.error("Error creating channel:", channelError);
      return;
    }

    const { error: participantError } = await supabase
      .from("participants")
      .insert([
        {
          channel: channelData.id,
          user: session.user.id,
        },
      ]);

    if (participantError) {
      console.error("Error adding creator as participant:", participantError);
      return;
    }

    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.navigate("/");
    }
  };

  return (
    <Formik
      initialValues={{ title: "", description: "" }}
      onSubmit={onSubmitChannel}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
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
          <Button onPress={() => handleSubmit()}>Submit</Button>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default ChannelCreate;
