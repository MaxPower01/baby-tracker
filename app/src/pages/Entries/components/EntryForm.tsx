import {
  Alert,
  AlertColor,
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  InputLabel,
  LinearProgress,
  LinearProgressProps,
  MenuItem,
  Slide,
  Slider,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
  jaJP,
} from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ActivityChip from "@/pages/Activities/components/ActivityChip";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { Entry } from "@/pages/Entries/types/Entry";
import { EntryHelper } from "@/pages/Entries/utils/EntryHelper";
import EntryModel from "@/pages/Entries/models/EntryModel";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { PageId } from "@/enums/PageId";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import { Stopwatch } from "@/components/Stopwatch/Stopwatch";
import SubActivityChip from "@/pages/Activities/components/SubActivityChip";
import { SubActivityModel } from "@/pages/Activities/models/SubActivityModel";
import { VolumeInput } from "@/components/VolumeInput";
import VolumeMenu from "@mui/material/Menu";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import formatStopwatchesTime from "@/utils/formatStopwatchesTime";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import poopMarks from "@/utils/poopMarks";
import { storage } from "@/firebase";
import urineMarks from "@/utils/urineMarks";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEntries } from "@/pages/Entries/hooks/useEntries";
import { useMenu } from "@/components/Menu/hooks/useMenu";

type EntryFormProps = {
  entry: Entry;
  shouldStartTimer?: "left" | "right";
};

export default function EntryForm(props: EntryFormProps) {
  return null;
}
