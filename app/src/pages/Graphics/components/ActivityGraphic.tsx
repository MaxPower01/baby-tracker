import * as d3 from "d3";

import { Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";

import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useEntries } from "@/pages/Entries/hooks/useEntries";

interface DataPoint {
  date: Date;
  value: number;
}

type Props = {
  activityType: ActivityType;
};

export default function ActivityGraphic(props: Props) {
  return null;
}
