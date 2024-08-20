import { H2, Paragraph, Text, YStack } from "tamagui";
import type { Event } from "@/types";

type EvenInfoProps = Event;

function EventInfo({
  theme: { title, description },
  submissions,
}: EvenInfoProps) {
  return (
    <YStack gap="$4">
      <H2>{title}</H2>
      <Paragraph fontSize={"$6"}>{description}</Paragraph>
      {submissions && <Text>{submissions.length} total submissions</Text>}
    </YStack>
  );
}

export default EventInfo;
