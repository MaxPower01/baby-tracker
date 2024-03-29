import { Entry } from "@/pages/Entry/types/Entry";
import EntryBody from "@/pages/Entries/components/EntryBody";
import EntryFooter from "@/pages/Entries/components/EntryFooter";
import { EntryHeader } from "@/pages/Entries/components/EntryHeader";
import { Stack } from "@mui/material";

type Props = {
  entry: Entry;
};

export default function EntryComponent(props: Props) {
  if (!props.entry) return null;
  return (
    <Stack>
      <EntryHeader entry={props.entry} />
      <EntryBody entry={props.entry} />
      <EntryFooter entry={props.entry} />
    </Stack>
  );
}
