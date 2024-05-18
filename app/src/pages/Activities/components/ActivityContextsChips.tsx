import { Box, Stack, useTheme } from "@mui/material";
import React, { useCallback, useState } from "react";
import {
  selectActivityContextsInFiltersState,
  selectEntryTypesInFiltersState,
  toggleActivityContextInFiltersState,
  toggleEntryTypeInFiltersState,
} from "@/state/slices/filtersSlice";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextChip } from "@/pages/Activities/components/ActivityContextChip";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeChip } from "@/pages/Activities/components/EntryTypeChip";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useSelector } from "react-redux";

type Props = {};

export function ActivityContextsChips(props: Props) {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const activityContexts = useSelector(selectActivityContextsInFiltersState);

  const toggleActivityContext = useCallback(
    (activityContext: ActivityContext) => {
      dispatch(toggleActivityContextInFiltersState({ activityContext }));
    },
    [props, dispatch]
  );

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
              onClick={toggleActivityContext}
              activityContext={activityContext}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
