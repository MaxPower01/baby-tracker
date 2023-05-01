import {
  AppBar,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
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
import { CSSBreakpoint, PageName } from "../../../lib/enums";
import { formatStopwatchesTime, getPagePath } from "../../../lib/utils";
import ActivityIcon from "../../activities/components/ActivityIcon";
import { ActivityModel } from "../../activities/models/ActivityModel";
import Stopwatch from "../../stopwatch/components/Stopwatch";
import { useAppDispatch } from "../../store/hooks/useAppDispatch";
import { EntryModel } from "../models/EntryModel";
import { setEntry } from "../state/entriesSlice";

type EntryFormProps = {
  entry: EntryModel;
};

export default function EntryForm(props: EntryFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const activity = props.entry?.activity;

  // Handle the activities drawer

  const [activitiesDrawerIsOpen, setActivitiesDrawerIsOpen] = useState(false);

  // Handle the date and time

  const initialStartDate = props.entry?.startDate ?? dayjs();
  const [startDate, setStartDate] = useState<Dayjs | null>(initialStartDate);

  // Handle the stopwatches

  const initialLeftTime = props.entry?.leftTime ?? 0;
  const [leftTime, setLeftTime] = useState<number>(initialLeftTime);

  const initialRightTime = props.entry?.rightTime ?? 0;
  const [rightTime, setRightTime] = useState<number>(initialRightTime);

  const time = useMemo(() => {
    return leftTime + rightTime;
  }, [leftTime, rightTime]);

  const [leftStopWatchIsRunning, setLeftStopWatchIsRunning] =
    useState<boolean>(false);
  const [rightStopWatchIsRunning, setRightStopWatchIsRunning] =
    useState<boolean>(false);

  const anyStopwatchIsRunning = useMemo(
    () => leftStopWatchIsRunning || rightStopWatchIsRunning,
    [leftStopWatchIsRunning, rightStopWatchIsRunning]
  );

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([leftTime, rightTime]);
  }, [leftTime, rightTime]);

  // Handle the notes

  const initialNote = props.entry?.note ?? "";
  const [note, setNote] = useState<string>(initialNote);

  // Handle the form submission

  const handleSubmit = useCallback(() => {
    const entry = new EntryModel({
      id: props.entry?.id,
      activity,
      startDate,
      time,
      leftTime,
      rightTime,
      note,
    });
    dispatch(setEntry({ id: entry.id, entry: entry.serialize() }));
    navigate(getPagePath(PageName.Home));
  }, [
    startDate,
    time,
    note,
    dispatch,
    navigate,
    activity,
    leftTime,
    rightTime,
  ]);

  return (
    <>
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          width: "100%",
        }}
      >
        <Section>
          {/* <Button
            onClick={() => setActivitiesDrawerIsOpen(true)}
            color="inherit"
          > */}
          <Stack justifyContent={"center"} alignItems={"center"}>
            <ActivityIcon
              activity={activity}
              sx={{
                fontSize: "5em",
              }}
            />
            <Stack direction={"row"} alignItems={"center"}>
              <Typography variant="h4" textAlign="center">
                {activity?.name}
              </Typography>
            </Stack>
          </Stack>
          {/* </Button> */}
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={localeFrCa}
          >
            <MobileDateTimePicker
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              disabled={anyStopwatchIsRunning}
              disableFuture={true}
              label=""
              slotProps={{
                textField: {
                  sx: {
                    "& input": {
                      textAlign: "center",
                      width: "auto",
                    },
                  },
                },
              }}
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

          {activity?.subTypes?.length && (
            <Grid container spacing={2} justifyContent="center">
              {activity.subTypes.map((subActivityType) => {
                const subActivity = new ActivityModel(subActivityType);
                return (
                  <Chip
                    key={`${activity.type}-${subActivity.type}`}
                    label={
                      <Typography variant="body2">{activity.name}</Typography>
                    }
                    icon={
                      <ActivityIcon
                        activity={subActivity}
                        sx={{
                          marginRight: 0,
                          marginLeft: 1,
                          fontSize: "1.35em",
                        }}
                      />
                    }
                    onClick={(e) => {}}
                    // color={
                    //   selectedTagIds.includes(tag.id) ? "primary" : undefined
                    // }
                    // variant={
                    //   selectedTagIds.includes(tag.id) ? "filled" : "outlined"
                    // }
                    // size="small"
                    sx={{ margin: 0.5 }}
                  />
                );
              })}
            </Grid>
          )}
        </Section>
        {activity?.hasDuration && (
          <Section dividerPosition="top">
            <SectionTitle title="Durée" />
            <Typography textAlign="center" variant="h4">
              {stopWatchTimeLabel}
            </Typography>
            <Stack
              direction={"row"}
              spacing={8}
              sx={{
                width: "100%",
              }}
            >
              <Stopwatch
                time={leftTime}
                setTime={setLeftTime}
                isRunning={leftStopWatchIsRunning}
                setIsRunning={setLeftStopWatchIsRunning}
                buttonIsDisabled={rightStopWatchIsRunning}
                inputsAreDisabled={anyStopwatchIsRunning}
                label={activity.hasSides ? "Gauche" : undefined}
                sx={{ flex: 1 }}
              />
              {activity.hasSides && (
                <Stopwatch
                  time={rightTime}
                  setTime={setRightTime}
                  isRunning={rightStopWatchIsRunning}
                  setIsRunning={setRightStopWatchIsRunning}
                  buttonIsDisabled={leftStopWatchIsRunning}
                  inputsAreDisabled={anyStopwatchIsRunning}
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
        <Container maxWidth={CSSBreakpoint.Small}>
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

      {/* <ActivitiesDrawer
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
      /> */}
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
