import { EntryModel } from "@/modules/entries/models/EntryModel";
import EntryBody from "./EntryBody";
import EntryFooter from "./EntryFooter";
import EntryHeader from "./EntryHeader";

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
