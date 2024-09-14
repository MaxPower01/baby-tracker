import { Box, Stack } from "@mui/material";

import { ActivityContextChip } from "@/pages/Activities/components/ActivityContextChip";
import { useFilters } from "@/components/Filters/FiltersProvider";

type Props = {};

export function ActivityContextsChips(props: Props) {
  const { activityContexts, toggleActivityContext } = useFilters();

  if (!activityContexts || !activityContexts.length) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        spacing={1}
      >
        {activityContexts.map((activityContext) => {
          return (
            <ActivityContextChip
              key={activityContext.id}
              isSelected={true}
              onClick={() => toggleActivityContext(activityContext)}
              activityContext={activityContext}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
