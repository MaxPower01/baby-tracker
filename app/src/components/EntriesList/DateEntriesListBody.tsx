import { EntriesListItem } from "@/components/EntriesList/EntriesListItem";
import { Entry } from "@/pages/Entry/types/Entry";
import { MenuProvider } from "@/components/MenuProvider";
import React from "react";
import { Stack } from "@mui/material";
import { groupEntriesByTime } from "@/utils/utils";

type Props = {
  entries: Entry[];
  dense?: boolean;
};
export function DateEntriesListBody(props: Props) {
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
      spacing={props.dense ? 0 : 2}
      sx={{
        width: "100%",
      }}
    >
      {Object.values(entriesByTime).map((group, index) => {
        const entries = group.entries;
        const key = `${entries[0].startTimestamp}-${
          entries[entries.length - 1].endTimestamp
        }-${index}`;
        return (
          <MenuProvider key={key}>
            <EntriesListItem entries={entries} />
          </MenuProvider>
        );
      })}
    </Stack>
  );
}
