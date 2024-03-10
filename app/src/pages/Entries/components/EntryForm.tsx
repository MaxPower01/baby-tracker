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
import { useCallback, useState } from "react";

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
import { StopwatchV2 } from "@/components/StopwatchV2";
import { VolumeInput } from "@/components/VolumeInput";
import { VolumeInputV2 } from "@/components/VolumeInputV2";
import { entryTypeHasContextSelector } from "@/pages/Entry/utils/entryTypeHasContextSelector";
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
  const [activityContext, setActivityContext] =
    useState<ActivityContextType | null>(null);
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

        {entryTypeHasStopwatch(props.entry.entryType) ? (
          <Section title="range">
            <DateTimeRangePicker />
          </Section>
        ) : (
          <Section title="date">
            <DateTimePicker layout="row" />
          </Section>
        )}

        {entryTypeHasContextSelector(props.entry.entryType) && (
          <Section title="context">
            <ActivityContextPicker
              entryType={props.entry.entryType}
              activityContext={activityContext}
              setActivityContext={setActivityContext}
            />
          </Section>
        )}

        {entryTypeHasVolume(props.entry.entryType) && (
          <Section title="stopwatch">
            <VolumeInputV2 />
          </Section>
        )}

        {entryTypeHasStopwatch(props.entry.entryType) && (
          <Section title="stopwatch">
            <StopwatchV2 />
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
