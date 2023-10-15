import Entries from "@/pages/Entries/components/Entries";
import Section from "@/components/Section";
import TimePeriod from "@/enums/TimePeriod";

export default function EntriesPage() {
  return (
    <Section>
      <Entries fetchTimePeriod={TimePeriod.Week} />
    </Section>
  );
}
