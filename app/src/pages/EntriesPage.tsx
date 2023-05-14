import Section from "@/common/components/Section";
import TimePeriod from "@/common/enums/TimePeriod";
import Entries from "@/modules/entries/components/Entries";

export default function EntriesPage() {
  return (
    <Section>
      <Entries fetchTimePeriod={TimePeriod.LastWeek} />
    </Section>
  );
}
