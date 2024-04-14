import Entries from "@/pages/History/components/Entries";
import { Section } from "@/components/Section";
import { TimePeriodId } from "@/enums/TimePeriodId";

export function HistoryPage() {
  return (
    <Section>
      <Entries fetchTimePeriod={TimePeriodId.Week} />
    </Section>
  );
}
