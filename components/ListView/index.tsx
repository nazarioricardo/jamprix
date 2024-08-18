import { ReactNode } from "react";
import { FlatList } from "react-native";

type ItemProps = {
  id: string;
  [key: string]: any;
};

type ListViewProps = {
  data: ItemProps[];
  Item: React.ComponentType<ItemProps>;
};

function ListView({ data, Item }: ListViewProps) {
  return (
    <FlatList
      data={data}
      style={{ padding: 24, height: "100%" }}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return <Item {...item} />;
      }}
    />
  );
}

export default ListView;
