import { type Channel as ChannelType } from "@/types";
import { Card } from "tamagui";
import Info from "./Info";

function ChannelCard(channel: ChannelType) {
  return (
    <Card padded elevate>
      <Info {...channel} />
    </Card>
  );
}

export default ChannelCard;
