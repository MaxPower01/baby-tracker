import { Box, Stack, Typography } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entry/types/Entry";
import EntryModel from "@/pages/Entry/models/EntryModel";
import { useMemo } from "react";
import { useSelector } from "react-redux";

type Props = {
  entry: Entry;
  hideIcon?: boolean;
  textColor?: string;
};

export default function EntryHeader(props: Props) {
  return null;
}
