import { Box, Stack, Typography } from "@mui/material";

import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { Entry } from "@/pages/Entries/types/Entry";
import EntryModel from "@/pages/Entries/models/EntryModel";
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
