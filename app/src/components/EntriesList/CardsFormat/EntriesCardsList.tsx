import React, { useEffect, useState } from "react";
import { Stack, useTheme } from "@mui/material";

import { EntriesCard } from "@/components/EntriesList/CardsFormat/EntriesCard";
import { Entry } from "@/pages/Entry/types/Entry";
import { MenuProvider } from "@/components/MenuProvider";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { groupEntriesByTime } from "@/utils/utils";

type Props = {
  entries: Entry[];
  dense?: boolean;
};
export function EntriesCardsList(props: Props) {
  const entriesByTime = groupEntriesByTime({
    entries: props.entries,
    timeUnit: "minute",
    timeStep: 30,
  });

  const theme = useTheme();

  if (props.entries.length === 0) {
    return null;
  }

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
            <EntriesCard entries={entries} />
          </MenuProvider>
        );
      })}
    </Stack>
  );
}
