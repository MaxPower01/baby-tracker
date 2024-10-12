import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import { EmptyStateContext } from "@/enums/EmptyStateContext";
import { EmptyStatePeriod } from "@/enums/EmptyStatePeriod";
import { EntryTypeIcon } from "@/pages/Activities/components/EntryTypeIcon";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";
import { ReactSVG } from "react-svg";
import { getActivityContextPickerNewItemLabel } from "@/pages/Activity/utils/getActivityContextPickerNewItemLabel";
import { getEmptyStateDescription } from "@/utils/getEmptyStateDescription";
import { getEmptyStateTitle } from "@/utils/getEmptyStateTitle";
import { getEntryTypeForEmptyState } from "@/utils/getEntryTypeForEmptyState";
import { isNullOrWhiteSpace } from "@/utils/utils";

type EmptyStateOverrideProps = {
  title?: string;
  description?: string;
  stickerSource?: string;
  buttonLabel?: string;
  onClick?: () => void;
};

export type EmptyStateProps = {
  type?: EntryTypeId;
  period?: EmptyStatePeriod;
  context: EmptyStateContext;
  activityContextType?: ActivityContextType;
  onClick?: () => void;
  override?: EmptyStateOverrideProps;
};

export function EmptyState(props: EmptyStateProps) {
  const theme = useTheme();
  let shouldRender = false;
  let buttonLabel = "";
  let title = getEmptyStateTitle(props);
  let description = getEmptyStateDescription(props);
  let stickerSource = "";
  let entryType = getEntryTypeForEmptyState(props);
  let onClick = props.onClick;
  if (props.override != null) {
    title = props.override.title ?? title;
    description = props.override.description ?? "";
    stickerSource = props.override.stickerSource ?? "";
    entryType = null;
    shouldRender = true;
    buttonLabel = props.override.buttonLabel ?? "";
    onClick = props.override.onClick;
  } else {
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
    } else if (props.context === EmptyStateContext.Charts) {
      buttonLabel = "Ajouter une entrée";
      stickerSource = "/stickers/empty-state--charts.svg";
      shouldRender = true;
    }
  }
  if (!shouldRender) {
    return null;
  }
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        {entryType != null ? (
          <EntryTypeIcon
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
        <Button variant="contained" onClick={onClick}>
          {buttonLabel}
        </Button>
      )}
    </Stack>
  );
}
