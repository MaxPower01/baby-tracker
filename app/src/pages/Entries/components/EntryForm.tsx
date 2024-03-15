import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useState } from "react";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextPicker } from "@/pages/Activity/components/ActivityContextPicker";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { DateTimePicker } from "@/components/DateTimePicker";
import { DateTimeRangePicker } from "@/components/DateTimeRangePicker";
import { Entry } from "@/pages/Entry/types/Entry";
import { ImagesInput } from "@/components/ImagesInput";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { NotesInput } from "@/components/NotesInput";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import { Stopwatch } from "@/components/Stopwatch";
import { VolumeInput } from "@/components/VolumeInput";
import { VolumeInputV2 } from "@/components/VolumeInputV2";
import { entryTypeHasContextSelector } from "@/pages/Entry/utils/entryTypeHasContextSelector";
import { entryTypeHasSides } from "@/pages/Entry/utils/entryTypeHasSides";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { getTitleForEntryType } from "@/utils/utils";

type EntryFormProps = {
  entry: Entry;
};

export default function EntryForm(props: EntryFormProps) {
  const theme = useTheme();
  const name = getTitleForEntryType(props.entry.entryType);
  const handleSubmit = useCallback(() => {}, []);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedActivityContexts, setSelectedActivityContexts] = useState<
    ActivityContext[]
  >([]);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [startTime, setStartTime] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs>(dayjs());
  return (
    <>
      <SectionStack>
        <Section title="header">
          <Stack justifyContent={"center"} alignItems={"center"}>
            <ActivityIcon
              type={props.entry.entryType}
              sx={{
                fontSize: "5em",
              }}
            />
            <Stack direction={"row"} alignItems={"center"}>
              <Typography variant="h5" textAlign="center">
                {name}
              </Typography>
            </Stack>
          </Stack>
        </Section>

        {entryTypeHasStopwatch(props.entry.entryType) ? (
          <Section title="range">
            <DateTimeRangePicker
              startDate={startDate}
              setStartDate={setStartDate}
              startTime={startTime}
              setStartTime={setStartTime}
              endDate={endDate}
              setEndDate={setEndDate}
              endTime={endTime}
              setEndTime={setEndTime}
            />
          </Section>
        ) : (
          <Section title="date">
            <DateTimePicker
              layout="row"
              iconPostion="left"
              align="left"
              date={startDate}
              setDate={setStartDate}
              time={startTime}
              setTime={setStartTime}
            />
          </Section>
        )}

        {entryTypeHasContextSelector(props.entry.entryType) && (
          <Section title="context">
            <ActivityContextPicker
              entryType={props.entry.entryType}
              selectedItems={selectedActivityContexts}
              setSelectedItems={setSelectedActivityContexts}
            />
          </Section>
        )}

        {entryTypeHasVolume(props.entry.entryType) && (
          <Section title="volume">
            <VolumeInputV2 />
          </Section>
        )}

        {entryTypeHasStopwatch(props.entry.entryType) && (
          <Section title="stopwatch">
            <Stopwatch
              size="big"
              hasSides={entryTypeHasSides(props.entry.entryType)}
            />
          </Section>
        )}

        <Section title="notes">
          <SectionTitle title="Notes" />
          <NotesInput />
        </Section>

        <Section title="images">
          <SectionTitle title="Images" />
          <ImagesInput />
        </Section>
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
  console.log("🚀 ~ EntryForm ~ props.entry:", props.entry);
}
