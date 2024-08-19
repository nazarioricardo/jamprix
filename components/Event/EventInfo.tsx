import { Text } from "tamagui";
import type { Event } from "@/types";

type EvenInfoProps = Event;

function EventInfo({
  theme: { title, description },
  submissions,
}: EvenInfoProps) {
  return (
    <>
      <Text>{title}</Text>
      <Text>{description}</Text>
      {submissions && <Text>{submissions.length} total submissions</Text>}
    </>
  );
}

export default EventInfo;
