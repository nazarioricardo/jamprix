import { View } from "react-native-ui-lib";

type PageViewProps = {
  children: React.ReactNode;
};

function PageView({ children }: PageViewProps) {
  return (
    <View style={{ margin: 24 }} useSafeArea>
      {children}
    </View>
  );
}

export default PageView;
