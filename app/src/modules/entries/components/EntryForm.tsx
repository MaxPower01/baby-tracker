import {
  AppBar,
  Button,
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
import { Dayjs } from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CSSBreakpoint from "../../../common/enums/CSSBreakpoint";
import PageName from "../../../common/enums/PageName";
import dayjsLocaleFrCa from "../../../lib/dayjs/dayjsLocaleFrCa";
import { formatStopwatchesTime, getPath } from "../../../lib/utils";
import ActivityChip from "../../activities/components/ActivityChip";
import ActivityIcon from "../../activities/components/ActivityIcon";
import { ActivityModel } from "../../activities/models/ActivityModel";
import Stopwatch from "../../stopwatch/components/Stopwatch";
import { useAppDispatch } from "../../store/hooks/useAppDispatch";
import { EntryModel } from "../models/EntryModel";
import { removeEntry, updateEntry } from "../state/entriesSlice";

type EntryFormProps = {
  entry: EntryModel;
  isEditing?: boolean;
};

export default function EntryForm(props: EntryFormProps) {
  const [entry, setEntry] = useState<EntryModel>(props.entry);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Handle the date and time

  const handleStartDateChange = (newStartDate: Dayjs | null) => {
    if (newStartDate == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      newEntry.startDate = newStartDate;
      return newEntry;
    });
  };

  // Handle the sub-activities

  const availableSubActivities = useMemo(() => {
    return (
      entry.activity?.subTypes?.map((type) => new ActivityModel(type)) ?? []
    );
  }, [entry]);

  const subActivitiesList = useMemo(() => {
    return availableSubActivities.map((a) => ({
      value: a,
      isSelected: entry.subActivities?.includes(a) ?? false,
    }));
  }, [availableSubActivities, entry.subActivities]);

  const toggleSubActivity = (subActivity: ActivityModel) => {
    setEntry((prevEntry) => {
      console.log(prevEntry.subActivities);
      const newEntry = prevEntry.clone();
      newEntry.subActivities = prevEntry.subActivities?.includes(subActivity)
        ? entry.subActivities?.filter((a) => a !== subActivity)
        : [...(entry.subActivities ?? []), subActivity];
      console.log(newEntry.subActivities);
      return newEntry;
    });
  };

  // Handle the stopwatches

  const initialLeftTime = entry.leftTime ?? 0;
  const [leftTime, setLeftTime] = useState<number>(initialLeftTime);

  const initialRightTime = entry.rightTime ?? 0;
  const [rightTime, setRightTime] = useState<number>(initialRightTime);

  const time = useMemo(() => {
    return leftTime + rightTime;
  }, [leftTime, rightTime]);

  const [leftStopWatchIsRunning, setLeftStopWatchIsRunning] =
    useState<boolean>(false);
  const [rightStopWatchIsRunning, setRightStopWatchIsRunning] =
    useState<boolean>(false);

  const anyStopwatchIsRunning = useMemo(() => {
    return leftStopWatchIsRunning || rightStopWatchIsRunning;
  }, [leftStopWatchIsRunning, rightStopWatchIsRunning]);

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([leftTime, rightTime]);
  }, [leftTime, rightTime]);

  // Handle the notes

  const initialNote = entry.note ?? "";
  const [note, setNote] = useState<string>(initialNote);

  // Handle the form submission

  const handleSubmit = useCallback(() => {
    dispatch(updateEntry({ id: entry.id, entry: entry.serialize() }));
    navigate(getPath({ page: PageName.Home }));
  }, [entry]);

  // Handle the delete button

  const handleDelete = useCallback(() => {
    dispatch(removeEntry({ id: entry.id }));
    navigate(getPath({ page: PageName.Home }));
  }, [dispatch, navigate, entry.id]);

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
          {entry.activity != null && (
            <Stack justifyContent={"center"} alignItems={"center"}>
              <ActivityIcon
                activity={entry.activity}
                sx={{
                  fontSize: "5em",
                }}
              />
              <Stack direction={"row"} alignItems={"center"}>
                <Typography variant="h4" textAlign="center">
                  {entry.activity?.name}
                </Typography>
              </Stack>
            </Stack>
          )}
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={dayjsLocaleFrCa}
          >
            <MobileDateTimePicker
              value={entry.startDate}
              onChange={handleStartDateChange}
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

          {(entry.activity?.subTypes?.length ?? 0) > 0 && (
            <Grid container gap={1} justifyContent="center">
              {entry.activity?.subTypes.map((subActivityType) => {
                if (entry.activity == null) return null;
                const subActivity = new ActivityModel(subActivityType);
                return (
                  <ActivityChip
                    key={`${entry.activity.type}-${subActivityType}`}
                    activity={subActivity}
                    isSelected={entry.subActivities?.includes(subActivity)}
                    onClick={() => toggleSubActivity(subActivity)}
                  />
                );
              })}
            </Grid>
          )}
        </Section>
        {entry.activity != null && entry.activity.hasDuration && (
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
                label={entry.activity.hasSides ? "Gauche" : undefined}
                sx={{ flex: 1 }}
              />
              {entry.activity.hasSides && (
                <Stopwatch label="Droite" sx={{ flex: 1 }} />
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
              spacing={2}
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={anyStopwatchIsRunning}
                fullWidth
              >
                Enregistrer
              </Button>
              {props.isEditing == true && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={anyStopwatchIsRunning}
                  fullWidth
                >
                  Supprimer
                </Button>
              )}
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
