import Entries from "@/pages/Entries/components/Entries";
import { Section } from "@/components/Section";
import { TimePeriodId } from "@/enums/TimePeriodId";

export function EntriesPage() {
  return (
    <Section>
      <Entries fetchTimePeriod={TimePeriodId.Week} />
    </Section>
  );
}
