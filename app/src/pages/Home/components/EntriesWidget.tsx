import { Box, Stack, useTheme } from "@mui/material";

import { EntriesWidgetItem } from "@/pages/Home/components/EntriesWidgetItem";
import { Entry } from "@/pages/Entry/types/Entry";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useSelector } from "react-redux";

type Props = {
  entries: Entry[];
};

export function EntriesWidget(props: Props) {
  const theme = useTheme();
  const entryTypesOrder = useSelector(selectEntryTypesOrder);
  const itemPadding = 4;
  const itemWidth = "10em";
  const mostRecentEntryByType = props.entries.reduce((acc, entry) => {
    if (acc[entry.entryTypeId] === undefined) {
      acc[entry.entryTypeId] = entry;
    } else if (entry.startTimestamp > acc[entry.entryTypeId].startTimestamp) {
      acc[entry.entryTypeId] = entry;
    }
    return acc;
  }, {} as Record<string, Entry>);
  if (entryTypesOrder.length === 0) {
    return null;
  }
  return (
    <Stack
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          overflowX: "scroll",
          // scrollbarWidth: "none",
          // msOverflowStyle: "none",
          // "&::-webkit-scrollbar": {
          //   display: "none",
          // },
          // Style the scrollbar
          "&::-webkit-scrollbar": {
            width: "5em",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
            transition: theme.transitions.create("box-shadow", {
              duration: theme.transitions.duration.shortest,
            }),
          },
          "&::-webkit-scrollbar-thumb:hover": {
            boxShadow: `inset 0 0 0 20px ${theme.palette.action.hover}`,
          },
        }}
      >
        <Stack
          direction={"row"}
          sx={{
            display: "grid",
            gap: 0.5,
            gridTemplateColumns: `${entryTypesOrder
              .map(() => "1fr")
              .join(" ")}`,
          }}
        >
          {entryTypesOrder.map((entryType, index) => {
            return (
              <EntriesWidgetItem
                key={index}
                entryType={entryType}
                padding={itemPadding}
                width={itemWidth}
                mostRecentEntryOfType={mostRecentEntryByType[entryType]}
              />
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}
