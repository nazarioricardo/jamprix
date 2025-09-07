import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import { Input, Button, TextArea } from "tamagui";
import { supabase } from "@/supabase/initSupabase";

type ChannelFormValues = {
  title: string;
  description: string;
};

function ChannelCreate() {
  const onSubmitChannel = async ({ title, description }: ChannelFormValues) => {
    const { data, error } = await supabase
      .from("channels") // or whatever your table is called
      .insert([
        {
          title,
          description,
        },
      ]);

    if (error) {
      console.error("Error creating channel:", error);
      return;
    }

    console.log("Channel created:", data);
    // Navigate back or show success message
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
