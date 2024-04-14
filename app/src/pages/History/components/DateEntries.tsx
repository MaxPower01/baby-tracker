import EntriesCard from "@/pages/History/components/EntriesCard";
import { Entry } from "@/pages/Entry/types/Entry";
import React from "react";
import { Stack } from "@mui/material";
import { groupEntriesByTime } from "@/utils/utils";

type Props = {
  entries: Entry[];
};
export function DateEntries(props: Props) {
  if (props.entries.length === 0) {
    return null;
  }
  const entriesByTime = groupEntriesByTime({
    entries: props.entries,
    timeUnit: "minute",
    timeStep: 30,
  });
  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
      }}
    >
      {Object.values(entriesByTime).map((group, index) => {
        const entries = group.entries;
        const key = `${entries[0].startTimestamp}-${
          entries[entries.length - 1].endTimestamp
        }-${index}`;
        return <EntriesCard key={key} entries={entries} />;
      })}
    </Stack>
  );
}
