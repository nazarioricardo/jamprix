import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import { Input, Button, TextArea } from "tamagui";

function ChannelCreate() {
  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={(values) => console.log(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values: { email } }) => (
        <View>
          <Input
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={email}
            placeholder="Title"
          />
          <TextArea placeholder="Description..." />
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
