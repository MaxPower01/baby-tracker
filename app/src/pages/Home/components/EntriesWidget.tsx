import { Box, Stack, useTheme } from "@mui/material";

import { EntriesWidgetItem } from "@/pages/Home/components/EntriesWidgetItem";
import { Entry } from "@/pages/Entry/types/Entry";
import { getDefaultEntryTypesOrder } from "@/pages/Entry/utils/getDefaultEntryTypesOrder";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";

type Props = {
  entries: Entry[];
};

export function EntriesWidget(props: Props) {
  const theme = useTheme();
  const { user } = useAuthentication();

  const itemPadding = 4;
  const itemWidth = "10em";
  const entryTypesOrder = user?.entryTypesOrder ?? getDefaultEntryTypesOrder();
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
