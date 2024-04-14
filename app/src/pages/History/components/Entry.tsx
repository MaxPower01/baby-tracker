import { Entry } from "@/pages/Entry/types/Entry";
import EntryBody from "@/pages/History/components/EntryBody";
import EntryFooter from "@/pages/History/components/EntryFooter";
import { EntryHeader } from "@/pages/History/components/EntryHeader";
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
