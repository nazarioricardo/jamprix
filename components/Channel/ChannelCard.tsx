import { type Channel as ChannelType } from "@/types";
import { Card } from "tamagui";
import ChannelInfo from "./ChannelInfo";

function ChannelCard(channel: ChannelType) {
  return (
    <Card padded elevate>
      <ChannelInfo {...channel} />
    </Card>
  );
}

export default ChannelCard;
