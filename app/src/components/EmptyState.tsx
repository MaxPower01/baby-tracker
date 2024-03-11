import { Button, Stack, Typography, useTheme } from "@mui/material";

import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EmptyStatePeriod } from "@/enums/EmptyStatePeriod";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import React from "react";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { getEmptyStateTitle } from "@/utils/getEmptyStateTitle";
import { isNullOrWhiteSpace } from "@/utils/utils";

type Props = {
  type?: EntryType;
  period?: EmptyStatePeriod;
  context: EmptyStateContext;
  activityContextType?: ActivityContextType;
  onClick?: () => void;
};

export function EmptyState(props: Props) {
  let shouldRender = false;
  let buttonLabel = "";
  const title = getEmptyStateTitle({ ...props });
  const theme = useTheme();
  if (props.context === EmptyStateContext.ActivityContextDrawer) {
    if (props.activityContextType != null) {
      buttonLabel = getActivityContextPickerNewItemLabel(
        props.activityContextType
      );
      shouldRender = true;
    }
  }
  if (!shouldRender) {
    return null;
  }
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        {props.type != null && (
          <ActivityIcon
            type={props.type}
            sx={{
              fontSize: "7em",
              opacity: theme.opacity.disabled,
            }}
          />
        )}
        {!isNullOrWhiteSpace(title) && (
          <Typography variant="h5" textAlign="center">
            {title}
          </Typography>
        )}
      </Stack>
      {!isNullOrWhiteSpace(buttonLabel) && (
        <Button variant="contained" color="primary" onClick={props.onClick}>
          {buttonLabel}
        </Button>
      )}
    </Stack>
  );
}
