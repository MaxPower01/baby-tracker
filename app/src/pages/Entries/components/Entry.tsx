import EntryBody from "@/pages/Entries/components/EntryBody";
import EntryFooter from "@/pages/Entries/components/EntryFooter";
import EntryHeader from "@/pages/Entries/components/EntryHeader";
import EntryModel from "@/pages/Entries/models/EntryModel";

type Props = {
  entry: EntryModel;
};

export default function Entry(props: Props) {
  if (!props.entry) return null;
  return (
    <>
      <EntryHeader entry={props.entry} />
      <EntryBody entry={props.entry} />
      <EntryFooter entry={props.entry} />
    </>
  );
}
