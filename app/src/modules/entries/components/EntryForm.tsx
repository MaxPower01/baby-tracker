import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import PageName from "@/common/enums/PageName";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import { formatStopwatchesTime, getPath } from "@/lib/utils";
import ActivityChip from "@/modules/activities/components/ActivityChip";
import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import { ActivityModel } from "@/modules/activities/models/ActivityModel";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import Stopwatch from "@/modules/stopwatch/components/Stopwatch";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
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
import { removeEntry, updateEntry } from "../state/entriesSlice";

type EntryFormProps = {
  entry: EntryModel;
  isEditing?: boolean;
};

export default function EntryForm(props: EntryFormProps) {
  const [entry, setEntry] = useState<EntryModel>(props.entry);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const save = useCallback(
    (entry: EntryModel) => {
      dispatch(updateEntry({ id: entry.id, entry: entry.serialize() }));
    },
    [dispatch, entry]
  );

  // Handle the date and time

  const handleStartDateChange = (newStartDate: Dayjs | null) => {
    if (newStartDate == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      newEntry.startDate = newStartDate;
      save(newEntry);
      return newEntry;
    });
  };

  // Handle the sub-activities

  const toggleSubActivity = (subActivity: ActivityModel) => {
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      if (
        newEntry.subActivities.map((a) => a.type).includes(subActivity.type)
      ) {
        newEntry.subActivities = newEntry.subActivities.filter(
          (a) => a.type !== subActivity.type
        );
      } else {
        newEntry.subActivities.push(subActivity);
      }
      console.log(newEntry.subActivities);
      save(newEntry);
      return newEntry;
    });
  };

  const subActivities = useMemo(() => {
    return entry.subActivities;
  }, [entry]);

  // Handle the stopwatches

  const anyStopwatchIsRunning = useMemo(() => {
    return entry.leftStopwatchIsRunning || entry.rightStopwatchIsRunning;
  }, [entry]);

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([entry.leftTime, entry.rightTime]);
  }, [entry]);

  const handleStopwatchChange = (params: {
    side: string;
    time: number;
    isRunning: boolean;
    lastUpdateTime: number | null;
  }) => {
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      if (params.side === "left") {
        newEntry.leftTime = params.time;
        newEntry.leftStopwatchIsRunning = params.isRunning;
        newEntry.leftStopwatchLastUpdateTime =
          params.lastUpdateTime ?? undefined;
      } else {
        newEntry.rightTime = params.time;
        newEntry.rightStopwatchIsRunning = params.isRunning;
        newEntry.rightStopwatchLastUpdateTime =
          params.lastUpdateTime ?? undefined;
      }
      save(newEntry);
      return newEntry;
    });
  };

  // Handle the notes

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      newEntry.note = event.target.value;
      save(newEntry);
      return newEntry;
    });
  };

  // Handle the form submission

  const handleSubmit = useCallback(() => {
    save(entry);
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
                      cursor: "pointer",
                      paddingTop: 1,
                      paddingBottom: 1,
                      borderColor: "transparent",
                      fontWeight: "bold",
                    },
                    // "& *:before": {
                    //   borderBottom: "none !important",
                    // },
                  },
                  variant: "outlined",
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
                    isSelected={subActivities
                      .map((a) => a.type)
                      .includes(subActivity.type)}
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
                time={entry.leftTime}
                isRunning={entry.leftStopwatchIsRunning}
                lastUpdateTime={entry.leftStopwatchLastUpdateTime ?? null}
                buttonIsDisabled={entry.rightStopwatchIsRunning}
                inputsAreDisabled={anyStopwatchIsRunning}
                onChange={(params) =>
                  handleStopwatchChange({
                    ...params,
                    side: "left",
                  })
                }
              />
              {entry.activity.hasSides && (
                <Stopwatch
                  label="Droite"
                  sx={{ flex: 1 }}
                  time={entry.rightTime}
                  isRunning={entry.rightStopwatchIsRunning}
                  lastUpdateTime={entry.rightStopwatchLastUpdateTime ?? null}
                  buttonIsDisabled={entry.leftStopwatchIsRunning}
                  inputsAreDisabled={anyStopwatchIsRunning}
                  onChange={(params) =>
                    handleStopwatchChange({
                      ...params,
                      side: "right",
                    })
                  }
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
            value={entry.note}
            onChange={handleNoteChange}
            fullWidth
            multiline
            minRows={5}
            disabled={anyStopwatchIsRunning}
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
                // disabled={anyStopwatchIsRunning}
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
