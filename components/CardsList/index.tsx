import { ElementType } from "react";
import { FlatList } from "react-native";

type ListDatum = Record<string, any> & { id: string };

type CardsListProps = {
  data: ListDatum[];
  Card: ElementType;
};

function CardsList({ data, Card }: CardsListProps) {
  return (
    <FlatList
      data={data}
      style={{
        padding: 24,
        height: "100%",
        overflow: "visible",
      }}
      contentContainerStyle={{
        display: "flex",
        justifyContent: "flex-start",
        gap: 12,
      }}
      keyExtractor={(data) => data.id}
      renderItem={({ item }) => {
        return <Card {...item} />;
      }}
    />
  );
}

export default CardsList;
