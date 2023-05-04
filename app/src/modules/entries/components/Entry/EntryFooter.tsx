import { EntryModel } from "@/modules/entries/models/EntryModel";

type Props = {
  entry: EntryModel;
};
export default function EntryFooter(props: Props) {
  if (!props.entry) return null;
  return null;
}
