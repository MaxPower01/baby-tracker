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
import OpacityIcon from "@mui/icons-material/Opacity";
import ScaleIcon from "@mui/icons-material/Scale";
import StraightenIcon from "@mui/icons-material/Straighten";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { isNullOrWhiteSpace } from "@/utils/utils";
import poopMarks from "@/utils/poopMarks";
import urineMarks from "@/utils/urineMarks";
import { useSelector } from "react-redux";

type Props = {
  entry: Entry;
  previousEntry?: Entry;
  sx?: SxProps | undefined;
};

export default function EntryBody(props: Props) {
  return null;
}
