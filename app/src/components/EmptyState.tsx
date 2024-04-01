import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EmptyStatePeriod } from "@/enums/EmptyStatePeriod";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import React from "react";
import { ReactSVG } from "react-svg";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { getEmptyStateDescription } from "@/utils/getEmptyStateDescription";
import { getEmptyStateTitle } from "@/utils/getEmptyStateTitle";
import { getEntryTypeForEmptyState } from "@/utils/getEntryTypeForEmptyState";
import { isNullOrWhiteSpace } from "@/utils/utils";

export type EmptyStateProps = {
  type?: EntryType;
  period?: EmptyStatePeriod;
  context: EmptyStateContext;
  activityContextType?: ActivityContextType;
  onClick?: () => void;
};

export function EmptyState(props: EmptyStateProps) {
  let shouldRender = false;
  let buttonLabel = "";
  const title = getEmptyStateTitle(props);
  const description = getEmptyStateDescription(props);
  const theme = useTheme();
  const entryType = getEntryTypeForEmptyState(props);
  let stickerSource = "";
  if (props.context === EmptyStateContext.ActivityContextDrawer) {
    if (props.activityContextType != null) {
      buttonLabel = getActivityContextPickerNewItemLabel(
        props.activityContextType
      );
      shouldRender = true;
    }
  } else if (props.context === EmptyStateContext.Entries) {
    buttonLabel = "Ajouter une entrée";
    stickerSource = "/stickers/empty-state--entries.svg";
    shouldRender = true;
  }
  if (!shouldRender) {
    return null;
  }
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        {entryType != null ? (
          <ActivityIcon
            type={entryType}
            sx={{
              fontSize: "7em",
              opacity: theme.opacity.disabled,
            }}
          />
        ) : !isNullOrWhiteSpace(stickerSource) ? (
          <Box
            sx={{
              fontSize: "7em",
              opacity: theme.opacity.disabled,
            }}
          >
            <ReactSVG src={stickerSource} className="Sticker" />
          </Box>
        ) : null}
        {!isNullOrWhiteSpace(title) && (
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              color: theme.customPalette.text.secondary,
            }}
          >
            {title}
          </Typography>
        )}
        {!isNullOrWhiteSpace(description) && (
          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              color: theme.customPalette.text.tertiary,
            }}
          >
            {description}
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
