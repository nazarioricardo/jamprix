import { type Channel as ChannelType } from "@/types";
import { Button, Card } from "tamagui";
import ChannelInfo from "./ChannelInfo";
import { useRouter } from "expo-router";

function ChannelCard(channel: ChannelType) {
  const router = useRouter();

  const onPressView = () => {
    const { created_by, ...rest } = channel;

    router.navigate({
      pathname: `channel/[id]`,
      params: {
        ...rest,
        createdBy: created_by.display_name,
        createdById: created_by.user_id,
      },
    });
  };

  return (
    <Card padded elevate>
      <Card.Header>
        <ChannelInfo {...channel} />
      </Card.Header>

      <Button onPress={onPressView}>View Channel</Button>
    </Card>
  );
}

export default ChannelCard;
