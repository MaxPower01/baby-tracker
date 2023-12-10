import {
  Box,
  Button,
  Card,
  MenuItem,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import ActivityButton from "@/pages/Activities/components/ActivityButton";
import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import EntryModel from "@/pages/Entries/models/EntryModel";
import { NewEntryDrawer } from "@/pages/Entry/components/NewEntryDrawer";
import { PageId } from "@/enums/PageId";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { selectActivities } from "@/pages/Activities/state/activitiesSlice";
import { useEntries } from "@/pages/Entries/hooks/useEntries";
import { useMenu } from "@/components/Menu/hooks/useMenu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {};

export default function NewEntryWidget(props: Props) {
  return null;
}
