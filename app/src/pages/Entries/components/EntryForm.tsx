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
import { getTitleForEntryType, isNullOrWhiteSpace } from "@/utils/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ActivityChip from "@/pages/Activities/components/ActivityChip";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { Entry } from "@/pages/Entries/types/Entry";
import { EntryDateTimePicker } from "@/components/EntryDateTimePicker";
import { EntryHelper } from "@/pages/Entry/utils/EntryHelper";
import EntryModel from "@/pages/Entries/models/EntryModel";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { PageId } from "@/enums/PageId";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import { Stopwatch } from "@/components/Stopwatch/Stopwatch";
import { StopwatchV2 } from "@/components/Stopwatch/StopwatchV2";
import SubActivityChip from "@/pages/Activities/components/SubActivityChip";
import { SubActivityModel } from "@/pages/Activities/models/SubActivityModel";
import { VolumeInput } from "@/components/VolumeInput";
import VolumeMenu from "@mui/material/Menu";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import formatStopwatchesTime from "@/utils/formatStopwatchesTime";
import getPath from "@/utils/getPath";
import poopMarks from "@/utils/poopMarks";
import { storage } from "@/firebase";
import urineMarks from "@/utils/urineMarks";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEntries } from "@/pages/Entries/hooks/useEntries";
import { useMenu } from "@/components/Menu/hooks/useMenu";

type EntryFormProps = {
  entry: Entry;
};

export default function EntryForm(props: EntryFormProps) {
  const theme = useTheme();
  const name = getTitleForEntryType(props.entry.entryType);
  const handleSubmit = useCallback(() => {}, []);
  const [isSaving, setIsSaving] = useState(false);
  return (
    <>
      <SectionStack>
        <Section title="header">
          <Stack justifyContent={"center"} alignItems={"center"}>
            <ActivityIcon
              type={props.entry.entryType}
              sx={{
                fontSize: "4em",
              }}
            />
            <Stack direction={"row"} alignItems={"center"}>
              <Typography variant="h4" textAlign="center" fontWeight={600}>
                {name}
              </Typography>
            </Stack>
          </Stack>
        </Section>

        <Section title="date-time">
          <EntryDateTimePicker />
        </Section>

        {EntryHelper.hasStopwatch(props.entry.entryType) && (
          <Section title="stopwatch">
            <StopwatchV2 />
          </Section>
        )}
      </SectionStack>

      <AppBar
        position="fixed"
        component={"footer"}
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "background.default",
          zIndex: (theme) => theme.zIndex.appBar + 1,
        }}
        color="transparent"
      >
        <Container maxWidth={CSSBreakpoint.Small}>
          <Toolbar disableGutters>
            <Stack
              flexGrow={1}
              sx={{
                paddingTop: 2,
                paddingBottom: 2,
              }}
              spacing={2}
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
                size="large"
                disabled={isSaving}
                sx={{
                  height: `calc(${theme.typography.button.fontSize} * 2.5)`,
                }}
              >
                <Typography variant="button">Enregistrer</Typography>
                <Box
                  sx={{
                    display: isSaving ? "flex" : "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LoadingIndicator
                    size={`calc(${theme.typography.button.fontSize} * 2)`}
                  />
                </Box>
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
