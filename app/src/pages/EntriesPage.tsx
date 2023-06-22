import Entries from "@/modules/entries/components/Entries";
import Section from "@/common/components/Section";
import TimePeriod from "@/common/enums/TimePeriod";

export default function EntriesPage() {
  return (
    <Section>
      <Entries fetchTimePeriod={TimePeriod.Week} />
    </Section>
  );
}
