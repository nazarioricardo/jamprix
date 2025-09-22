import { H2, H3, Paragraph, Text, YStack } from "tamagui";
import { type Event, EventStatusEnum } from "@/types";

type EvenInfoProps = Event;

const StatusMap = {
  [EventStatusEnum.PENDING]: "Scheduled",
  [EventStatusEnum.ACTIVE]: "Playing",
  [EventStatusEnum.SCORING]: "Scoring",
  [EventStatusEnum.DONE]: "Done",
};

function EventInfo({
  theme: { title, description },
  submissions,
  status,
}: EvenInfoProps) {
  const eventStatus = StatusMap[status];
  return (
    <YStack gap="$4">
      <H2>{title}</H2>
      <H3>{eventStatus}</H3>
      <Paragraph fontSize={"$6"}>{description}</Paragraph>
      {submissions && <Text>{submissions.length} total submissions</Text>}
    </YStack>
  );
}

export default EventInfo;
