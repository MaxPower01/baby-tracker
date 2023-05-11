import EntryBody from "@/modules/entries/components/EntryBody";
import EntryFooter from "@/modules/entries/components/EntryFooter";
import EntryHeader from "@/modules/entries/components/EntryHeader";
import EntryModel from "@/modules/entries/models/EntryModel";

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
