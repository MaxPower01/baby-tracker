import { Entry } from "@/pages/Entry/types/Entry";
import EntryBody from "@/pages/Entries/components/EntryBody";
import EntryFooter from "@/pages/Entries/components/EntryFooter";
import EntryHeader from "@/pages/Entries/components/EntryHeader";

type Props = {
  entry: Entry;
};

export default function EntryComponent(props: Props) {
  if (!props.entry) return null;
  return (
    <>
      <EntryHeader entry={props.entry} />
      <EntryBody entry={props.entry} />
      <EntryFooter entry={props.entry} />
    </>
  );
}
