import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  SxProps,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import localeFrCa from "dayjs/locale/fr-ca";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActivityType, CSSBreakpoint, PageName } from "../../../lib/enums";
import {
  formatStopwatchesTime,
  getPagePath,
  getPath,
} from "../../../lib/utils";
import ActivitiesDrawer from "../../activities/components/ActivitiesDrawer";
import ActivityIcon from "../../activities/components/ActivityIcon";
import { Activity } from "../../activities/models/Activity";
import Stopwatch from "../../stopwatch/components/Stopwatch";
import { useAppDispatch } from "../../store/hooks/useAppDispatch";
import { Entry } from "../models/Entry";
import { addEntry } from "../state/entriesSlice";

type EntryFormProps = {
  activity: Activity;
};

export default function EntryForm(props: EntryFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Handle the activities drawer

  const [activitiesDrawerIsOpen, setActivitiesDrawerIsOpen] = useState(false);

  // Handle the date and time

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());

  // Handle the stopwatches

  const [leftStopwatchTime, setLeftStopWatchTime] = useState<number>(0);
  const [rightStopwatchTime, setRightStopWatchTime] = useState<number>(0);

  const time = useMemo(() => {
    return leftStopwatchTime + rightStopwatchTime;
  }, [leftStopwatchTime, rightStopwatchTime]);

  const [leftStopWatchIsRunning, setLeftStopWatchIsRunning] =
    useState<boolean>(false);
  const [rightStopWatchIsRunning, setRightStopWatchIsRunning] =
    useState<boolean>(false);

  const anyStopwatchIsRunning = useMemo(
    () => leftStopWatchIsRunning || rightStopWatchIsRunning,
    [leftStopWatchIsRunning, rightStopWatchIsRunning]
  );

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([leftStopwatchTime, rightStopwatchTime]);
  }, [leftStopwatchTime, rightStopwatchTime]);

  // Handle the notes

  const [note, setNote] = useState<string>("");

  // Handle the form submission

  const handleSubmit = useCallback(() => {
    const entry = new Entry({
      activity: props.activity,
      startDate: startDate ?? dayjs(),
      time,
      leftTime: leftStopwatchTime,
      rightTime: rightStopwatchTime,
      note,
    });
    dispatch(addEntry(entry.serialize()));
    navigate(getPagePath(PageName.Home));
  }, [props.activity, startDate, time, note, dispatch, navigate]);

  return (
    <>
      <Stack
        spacing={4}
        alignItems="center"
        sx={{
          width: "100%",
        }}
      >
        <Section>
          <Button
            onClick={() => setActivitiesDrawerIsOpen(true)}
            color="inherit"
          >
            <Box>
              <ActivityIcon
                activity={props.activity}
                sx={{
                  fontSize: "150%",
                }}
              />
              <Stack direction={"row"} alignItems={"center"}>
                <Typography variant="h4" textAlign="center">
                  {props.activity.name}
                </Typography>
                {/* <ExpandMoreIcon /> */}
              </Stack>
            </Box>
          </Button>
          <ActivitiesDrawer
            isOpen={activitiesDrawerIsOpen}
            onClose={() => setActivitiesDrawerIsOpen(false)}
            handleActivityClick={(type: ActivityType) =>
              navigate(
                getPath({
                  page: PageName.Entry,
                  params: { activity: type.toString() },
                })
              )
            }
          />
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={localeFrCa}
          >
            <MobileDateTimePicker
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
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
                time={leftStopwatchTime}
                setTime={setLeftStopWatchTime}
                isRunning={leftStopWatchIsRunning}
                setIsRunning={setLeftStopWatchIsRunning}
                isDisabled={rightStopWatchIsRunning}
                label={props.activity.hasSides ? "Gauche" : undefined}
                sx={{ flex: 1 }}
              />
              {props.activity.hasSides && (
                <Stopwatch
                  time={rightStopwatchTime}
                  setTime={setRightStopWatchTime}
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
            name="note"
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            fullWidth
            multiline
            minRows={5}
          />
        </Section>
      </Stack>

      <AppBar
        {...props}
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "background.paper",
        }}
        color="transparent"
      >
        <Container maxWidth={CSSBreakpoint.Medium}>
          <Toolbar disableGutters>
            <Stack
              flexGrow={1}
              direction="row"
              sx={{ justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={anyStopwatchIsRunning}
                fullWidth
              >
                Enregistrer
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </>
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
