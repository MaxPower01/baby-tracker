import {
  Divider,
  Paper,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import localeFrCa from "dayjs/locale/fr-ca";
import { useMemo, useState } from "react";
import { formatStopwatchesTime } from "../../../lib/utils";
import ActivityIcon from "../../activities/components/ActivityIcon";
import { Activity } from "../../activities/models/Activity";
import Stopwatch from "../../stopwatch/components/Stopwatch";

type EntryFormProps = {
  activity: Activity;
};

export default function EntryForm(props: EntryFormProps) {
  // Handle the start date and time

  const [startDateTime, setStartDateTime] = useState<Dayjs | null>(dayjs());

  // Handle the stopwatches

  const [leftStopwatchTimeInSeconds, setLeftStopWatchTimeInSeconds] =
    useState<number>(0);
  const [rightStopwatchTimeInSeconds, setRightStopWatchTimeInSeconds] =
    useState<number>(0);

  const [leftStopWatchIsRunning, setLeftStopWatchIsRunning] =
    useState<boolean>(false);
  const [rightStopWatchIsRunning, setRightStopWatchIsRunning] =
    useState<boolean>(false);

  const anyStopwatchIsRunning = useMemo(
    () => leftStopWatchIsRunning || rightStopWatchIsRunning,
    [leftStopWatchIsRunning, rightStopWatchIsRunning]
  );

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([
      leftStopwatchTimeInSeconds,
      rightStopwatchTimeInSeconds,
    ]);
  }, [leftStopwatchTimeInSeconds, rightStopwatchTimeInSeconds]);

  // Handle the notes

  const [notes, setNotes] = useState<string>("");

  return (
    <Stack
      spacing={4}
      alignItems="center"
      sx={{
        width: "100%",
      }}
    >
      <Section>
        <ActivityIcon
          activity={props.activity}
          sx={{
            fontSize: "150%",
          }}
        />
        <Typography variant="h4" textAlign="center">
          {props.activity.name}
        </Typography>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={localeFrCa}
        >
          <MobileDateTimePicker
            value={startDateTime}
            onChange={(newValue) => setStartDateTime(newValue)}
            disabled={anyStopwatchIsRunning}
            disableFuture={true}
            label="Départ"
            ampm={false}
            localeText={{
              toolbarTitle: "",
              okButtonLabel: "OK",
              cancelButtonLabel: "Annuler",
              nextMonth: "Mois suivant",
              previousMonth: "Mois précédent",
            }}
          />
        </LocalizationProvider>
      </Section>

      {props.activity?.hasDuration && (
        <Section dividerPosition="top">
          <SectionTitle title="Durée" />
          <Typography textAlign="center" variant="h4">
            {stopWatchTimeLabel}
          </Typography>
          <Stack
            direction={"row"}
            sx={{
              width: "100%",
            }}
          >
            <Stopwatch
              timeInSeconds={leftStopwatchTimeInSeconds}
              setTimeInSeconds={setLeftStopWatchTimeInSeconds}
              isRunning={leftStopWatchIsRunning}
              setIsRunning={setLeftStopWatchIsRunning}
              isDisabled={rightStopWatchIsRunning}
              label={props.activity.hasSides ? "Gauche" : undefined}
              sx={{ flex: 1 }}
            />
            {props.activity.hasSides && (
              <Stopwatch
                timeInSeconds={rightStopwatchTimeInSeconds}
                setTimeInSeconds={setRightStopWatchTimeInSeconds}
                isRunning={rightStopWatchIsRunning}
                setIsRunning={setRightStopWatchIsRunning}
                isDisabled={leftStopWatchIsRunning}
                label="Droite"
                sx={{ flex: 1 }}
              />
            )}
          </Stack>
        </Section>
      )}

      <Section dividerPosition="top">
        <SectionTitle title="Notes" />
        <TextField
          label=""
          name="notes"
          type="text"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          fullWidth
          multiline
          minRows={5}
        />
      </Section>
    </Stack>
  );
}

function Section(props: {
  children: React.ReactNode;
  dividerPosition?: "top" | "bottom";
  sx?: SxProps;
}) {
  return (
    <>
      {props.dividerPosition === "top" && <Divider sx={{ width: "100%" }} />}

      <Paper
        elevation={0}
        component={"section"}
        sx={{ width: "100%", paddingTop: 2, paddingBottom: 2, ...props.sx }}
      >
        <Stack component={"section"} alignItems="center" spacing={2}>
          {props.children}
        </Stack>
      </Paper>

      {props.dividerPosition === "bottom" && <Divider sx={{ width: "100%" }} />}
    </>
  );
}

function SectionTitle(props: { title: string }) {
  return (
    <Typography
      variant="h5"
      textAlign="left"
      sx={{
        fontWeight: "bold",
        width: "100%",
      }}
    >
      {props.title}
    </Typography>
  );
}
