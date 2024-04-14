import {
  Box,
  Grid,
  ImageList,
  ImageListItem,
  LinearProgress,
  Slider,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import {
  selectShowPoopQuantityInHomePage,
  selectShowUrineQuantityInHomePage,
} from "@/state/slices/settingsSlice";
import { useCallback, useEffect, useMemo, useState } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activity/models/ActivityModel";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { Entry } from "@/pages/Entry/types/Entry";
import EntryModel from "@/pages/Entry/models/EntryModel";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import OpacityIcon from "@mui/icons-material/Opacity";
import ScaleIcon from "@mui/icons-material/Scale";
import StraightenIcon from "@mui/icons-material/Straighten";
import { entryTypeHasPoop } from "@/pages/Entry/utils/entryTypeHasPoop";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { getPoopColor } from "@/utils/getPoopColor";
import { getPoopTextureName } from "@/utils/getPoopTextureName";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { selectPoopTextures } from "@/state/slices/activitiesSlice";
import urineMarks from "@/utils/urineMarks";
import { useSelector } from "react-redux";

type Props = {
  entry: Entry;
  previousEntry?: Entry;
  sx?: SxProps | undefined;
};

export default function EntryBody(props: Props) {
  const theme = useTheme();
  let poopTextureLabel = "";
  let poopTextureName = "";
  if (entryTypeHasPoop(props.entry.entryTypeId)) {
    if (props.entry.poopTextureId != null) {
      poopTextureName = getPoopTextureName(props.entry.poopTextureId);
    }
    if (props.entry.entryTypeId == EntryTypeId.Poop) {
      poopTextureLabel = `Consistance:`;
    } else {
      poopTextureLabel = `Consistance du caca:`;
    }
  }
  return (
    <Stack
      spacing={0.5}
      sx={{
        ...props.sx,
        width: "100%",
      }}
    >
      {!isNullOrWhiteSpace(props.entry.note) && (
        <Typography
          variant={"body2"}
          sx={{
            opacity: theme.opacity.tertiary,
            fontWeight: 400,
          }}
        >
          {props.entry.note}
        </Typography>
      )}
      {!isNullOrWhiteSpace(poopTextureLabel) &&
        !isNullOrWhiteSpace(poopTextureName) && (
          <Box>
            <Typography
              variant={"body2"}
              sx={{
                opacity: theme.opacity.tertiary,
                fontWeight: 400,
                display: "inline",
              }}
            >
              {poopTextureLabel}
            </Typography>
            <Typography
              variant={"body2"}
              sx={{
                opacity: theme.opacity.secondary,
                fontWeight: 400,
                display: "inline",
              }}
            >
              {" "}
              {poopTextureName}
            </Typography>
          </Box>
        )}
    </Stack>
  );
}
