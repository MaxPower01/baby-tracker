import React, { useEffect, useState } from "react";
import { Stack, useTheme } from "@mui/material";

import { EntriesCard } from "@/components/EntriesList/CardsFormat/EntriesCard";
import { EntriesDateHeader } from "@/components/EntriesList/EntriesDateHeader";
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

  // const [topHeight, setTopHeight] = useState<{
  //   topbarHeight: number;
  //   filterChipsHeight: number;
  //   totalHeight: number;
  // } | null>(null);

  // useEffect(() => {
  //   function handleResize() {
  //     requestAnimationFrame(() => {
  //       const result = {
  //         topbarHeight: 0,
  //         filterChipsHeight: 0,
  //         totalHeight: 0,
  //       };
  //       const topbar = document.getElementById("topbar");
  //       let topbarHeight = topbar?.clientHeight;
  //       if (topbarHeight != null) {
  //         topbarHeight -= 1;
  //       }
  //       result.topbarHeight = topbarHeight ?? 0;
  //       const filterChips =
  //         document.getElementsByClassName("EntriesFilterChips");
  //       if (filterChips.length > 0) {
  //         const filterChipsHeight = filterChips[0].clientHeight - 1;
  //         result.filterChipsHeight = filterChipsHeight;
  //       }
  //       result.totalHeight = result.topbarHeight + result.filterChipsHeight;
  //       setTopHeight(result);
  //     });
  //   }
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  if (props.entries.length === 0) {
    return null;
  }

  return (
    <Stack
      sx={{
        // position: topHeight != null ? "sticky" : undefined,
        // top: topHeight != null ? topHeight.totalHeight : undefined,
        // zIndex: 2,
        // backgroundColor: theme.palette.background.default,
        width: "100%",
      }}
      spacing={2}
    >
      <EntriesDateHeader
        date={getDateFromTimestamp(props.entries[0].startTimestamp)}
        entries={props.entries}
      />

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
    </Stack>
  );
}
