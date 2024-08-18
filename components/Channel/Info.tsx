import { type Channel } from "@/types";
import { Text, YStack, H3, H2 } from "tamagui";

function ChannelInfo({ title, description, created_by }: Channel) {
  return (
    <YStack alignItems="flex-start">
      <H2>{title}</H2>
      <H3>{description}</H3>
      <Text>by {created_by.email}</Text>
    </YStack>
  );
}

export default ChannelInfo;
