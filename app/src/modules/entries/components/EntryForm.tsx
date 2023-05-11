import Section from "@/common/components/Section";
import SectionTitle from "@/common/components/SectionTitle";
import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import PageName from "@/common/enums/PageName";
import { db } from "@/firebase";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import {
  formatStopwatchesTime,
  getPath,
  isNullOrWhiteSpace,
} from "@/lib/utils";
import ActivityChip from "@/modules/activities/components/ActivityChip";
import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import SubActivityChip from "@/modules/activities/components/SubActivityChip";
import { ActivityModel } from "@/modules/activities/models/ActivityModel";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import { EntryModel } from "@/modules/entries/models/EntryModel";
import { setEditingEntryId } from "@/modules/entries/state/entriesSlice";
import Stopwatch from "@/modules/stopwatch/components/Stopwatch";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import VolumeInput from "@/modules/volume/components/VolumeInput";
import {
  AppBar,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type EntryFormProps = {
  entry: EntryModel;
  isEditing?: boolean;
  shouldStartTimer?: "left" | "right";
};

export default function EntryForm(props: EntryFormProps) {
  const [entry, setEntry] = useState<EntryModel>(props.entry);
  const [endDateWasEditedManually, setEndDateWasEditedManually] =
    useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { user, children } = useAuthentication();

  useEffect(() => {
    if (entry.anyStopwatchIsRunning) {
      // If any stopwatch is running, we need to update the entry's time
      // so that it is up to date on the first render.
      setEntry((prevEntry) => {
        const newEntry = prevEntry.clone();
        newEntry.updateTime();
        return newEntry;
      });
    }
  }, []);

  useEffect(() => {
    if (entry.id) dispatch(setEditingEntryId(entry.id));
  }, [entry]);

  // const save = useCallback(
  //   (entry: EntryModel) => {
  //     dispatch(updateEntry({ id: entry.id, entry: entry.serialize() }));
  //   },
  //   [dispatch, entry]
  // );

  // Handle the date and time

  const handleStartDateChange = (newStartDate: Dayjs | null) => {
    if (newStartDate == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      newEntry.startDate = newStartDate.toDate();
      // save(newEntry);
      return newEntry;
    });
  };

  const handleEndDateChange = (newEndDate: Dayjs | null) => {
    if (newEndDate == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      newEntry.endDate = newEndDate.toDate();
      // save(newEntry);
      return newEntry;
    });
    setEndDateWasEditedManually(true);
  };

  // Handle the sub-activities

  const toggleLinkedActivity = (subActivity: ActivityModel) => {
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      if (
        newEntry.linkedActivities.map((a) => a.type).includes(subActivity.type)
      ) {
        newEntry.linkedActivities = newEntry.linkedActivities.filter(
          (a) => a.type !== subActivity.type
        );
      } else {
        newEntry.linkedActivities.push(subActivity);
      }
      newEntry.linkedActivities = newEntry.linkedActivities.filter(
        (a, index, self) => self.findIndex((b) => b.type === a.type) === index
      );
      // save(newEntry);
      return newEntry;
    });
  };

  const toggleSubActivity = (subActivity: SubActivityModel) => {
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
      newEntry.subActivities = newEntry.subActivities.filter(
        (a, index, self) => self.findIndex((b) => b.type === a.type) === index
      );
      // save(newEntry);
      return newEntry;
    });
  };

  const linkedActivities = useMemo(() => {
    return entry.linkedActivities;
  }, [entry]);

  const subActivities = useMemo(() => {
    return entry.subActivities;
  }, [entry]);

  const subActivitiesTypes = useMemo(() => {
    let result = entry.linkedActivities
      .map((a) => {
        return a.subTypes.map((subType) => {
          return subType;
        });
      })
      .flat();
    if (entry.activity != null) {
      result = result.concat(
        entry.activity.subTypes.map((subType) => {
          return subType;
        })
      );
    }
    return result.filter((subType, index, self) => {
      return self.findIndex((s) => s === subType) === index;
    });
  }, [entry]);

  // Handle the volume

  const handleVolumeChange = (params: { side: string; newVolume: number }) => {
    if (params.newVolume < 0) return;
    if (isNaN(params.newVolume)) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      if (params.side === "left") {
        newEntry.leftVolume = params.newVolume;
      } else if (params.side === "right") {
        newEntry.rightVolume = params.newVolume;
      }
      // save(newEntry);
      return newEntry;
    });
  };

  const volumeLabel = useMemo(() => {
    const volume = entry.leftVolume + entry.rightVolume;
    return `${volume} ml`;
  }, [entry]);

  // Handle the stopwatches

  const anyStopwatchIsRunning = useMemo(() => {
    return entry.leftStopwatchIsRunning || entry.rightStopwatchIsRunning;
  }, [entry]);

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([entry.leftTime, entry.rightTime], true);
  }, [entry]);

  // const handleStopwatchChange = (params: {
  //   side: string;
  //   time: number;
  //   isRunning: boolean;
  //   lastUpdateTime: number | null;
  // }) => {
  //   setEntry((prevEntry) => {
  //     const newEntry = prevEntry.clone();
  //     if (params.side === "left") {
  //       newEntry.leftTime = params.time;
  //       newEntry.leftStopwatchIsRunning = params.isRunning;
  //       newEntry.leftStopwatchLastUpdateTime = params.lastUpdateTime ?? null;
  //     } else {
  //       newEntry.rightTime = params.time;
  //       newEntry.rightStopwatchIsRunning = params.isRunning;
  //       newEntry.rightStopwatchLastUpdateTime = params.lastUpdateTime ?? null;
  //     }
  //     newEntry.setEndDate();
  //     // save(newEntry);
  //     return newEntry;
  //   });
  // };

  const handleStopwatchChange = useCallback(
    (params: {
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
          newEntry.leftStopwatchLastUpdateTime = params.lastUpdateTime ?? null;
        } else {
          newEntry.rightTime = params.time;
          newEntry.rightStopwatchIsRunning = params.isRunning;
          newEntry.rightStopwatchLastUpdateTime = params.lastUpdateTime ?? null;
        }
        if (!endDateWasEditedManually) {
          newEntry.setEndDate();
        }
        // save(newEntry);
        return newEntry;
      });
    },
    [endDateWasEditedManually]
  );

  useEffect(() => {
    if (props.shouldStartTimer != null) {
      if (props.shouldStartTimer === "left") {
        handleStopwatchChange({
          side: "left",
          time: 0,
          isRunning: true,
          lastUpdateTime: Date.now(),
        });
      } else if (props.shouldStartTimer === "right") {
        handleStopwatchChange({
          side: "right",
          time: 0,
          isRunning: true,
          lastUpdateTime: Date.now(),
        });
      }
    }
  }, []);

  // Handle the notes

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      newEntry.note = event.target.value;
      // save(newEntry);
      return newEntry;
    });
  };

  // Handle the form submission

  const handleSubmit = useCallback(async () => {
    if (user == null || isNullOrWhiteSpace(user.selectedChild)) return;
    if (!endDateWasEditedManually) entry.setEndDate();
    const { id, ...rest } = entry.toJSON({ keepDates: true });
    if (id == null) {
      const docRef = await addDoc(
        collection(db, `children/${user.selectedChild}/entries`),
        {
          ...rest,
        }
      );
      entry.id = docRef.id;
      // dispatch(
      //   updateEntry({
      //     entry: entry.serialize(),
      //     id: docRef.id,
      //   })
      // );
    } else {
      await setDoc(doc(db, `children/${user.selectedChild}/entries/${id}`), {
        ...rest,
      });
      // dispatch(
      //   updateEntry({
      //     entry: entry.serialize(),
      //     id,
      //   })
      // );
    }
    navigate(getPath({ page: PageName.Home }));
  }, [entry, user]);

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
          <Stack
            direction={"row"}
            justifyContent={"center"}
            sx={{
              width: "100%",
            }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={dayjsLocaleFrCa}
            >
              <MobileDateTimePicker
                value={dayjs(entry.startDate)}
                onChange={handleStartDateChange}
                disabled={anyStopwatchIsRunning}
                disableFuture={true}
                label="Date de début"
                sx={{
                  flex: 1,
                }}
                slotProps={{
                  textField: {
                    sx: {
                      "& input": {
                        width: "100%",
                        cursor: "pointer",
                        textAlign: "center",
                      },
                      "& *:before": {
                        border: "none !important",
                      },
                    },
                    variant: "standard",
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
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={dayjsLocaleFrCa}
            >
              <MobileDateTimePicker
                value={dayjs(entry.endDate)}
                onChange={handleEndDateChange}
                disabled={anyStopwatchIsRunning}
                disableFuture={true}
                label="Date de fin"
                sx={{
                  flex: 1,
                }}
                slotProps={{
                  textField: {
                    sx: {
                      "& input": {
                        width: "100%",
                        cursor: "pointer",
                        textAlign: "center",
                      },
                      "& *:before": {
                        border: "none !important",
                      },
                    },
                    variant: "standard",
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
          </Stack>
          {(entry.activity?.linkedTypes?.length ?? 0) > 0 && (
            <Grid container gap={1} justifyContent="center">
              {entry.activity?.linkedTypes.map((activityType) => {
                if (entry.activity == null) return null;
                const activity = new ActivityModel(activityType);
                return (
                  <ActivityChip
                    key={`${entry.activity.type}-${activityType}`}
                    activity={activity}
                    isSelected={linkedActivities
                      .map((a) => a.type)
                      .includes(activity.type)}
                    onClick={() => toggleLinkedActivity(activity)}
                    isSelectable={true}
                    isDisabled={anyStopwatchIsRunning}
                  />
                );
              })}
            </Grid>
          )}
          {(subActivitiesTypes?.length ?? 0) > 0 && (
            <Grid container gap={1} justifyContent="center">
              {subActivitiesTypes.map((subActivityType) => {
                if (entry.activity == null) return null;
                const subActivity = new SubActivityModel(subActivityType);
                return (
                  <SubActivityChip
                    key={`${entry.activity.type}-${subActivityType}`}
                    subActivity={subActivity}
                    isSelected={subActivities
                      .map((a) => a.type)
                      .includes(subActivity.type)}
                    onClick={() => toggleSubActivity(subActivity)}
                    isSelectable={true}
                    isDisabled={anyStopwatchIsRunning}
                  />
                );
              })}
            </Grid>
          )}
        </Section>

        {entry.activity?.hasVolume == true && (
          <Section dividerPosition="top">
            <SectionTitle title="Quantité" />
            <Typography textAlign="center" variant="h4">
              {volumeLabel}
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"space-around"}
              spacing={4}
              sx={{
                width: "100%",
              }}
            >
              <VolumeInput
                volume={entry.leftVolume}
                onChange={({ volume }) =>
                  handleVolumeChange({ side: "left", newVolume: volume })
                }
                label={entry.activity?.hasSides ? "Gauche" : undefined}
                inputsAreDisabled={anyStopwatchIsRunning}
              />
              {entry.activity?.hasSides && (
                <VolumeInput
                  volume={entry.rightVolume}
                  onChange={({ volume }) =>
                    handleVolumeChange({ side: "right", newVolume: volume })
                  }
                  label="Droite"
                  inputsAreDisabled={anyStopwatchIsRunning}
                />
              )}
            </Stack>
          </Section>
        )}
        {entry.activity?.hasDuration == true && (
          <Section dividerPosition="top">
            <SectionTitle title="Durée" />
            <Typography textAlign="center" variant="h4">
              {stopWatchTimeLabel}
            </Typography>
            <Stack direction={"row"} spacing={4}>
              <Stopwatch
                label={entry.activity?.hasSides ? "Gauche" : undefined}
                sx={{ flex: 1, width: "100%" }}
                time={entry.leftTime}
                isRunning={entry.leftStopwatchIsRunning}
                lastUpdateTime={entry.leftStopwatchLastUpdateTime ?? null}
                buttonIsDisabled={entry.rightStopwatchIsRunning}
                // inputsAreDisabled={anyStopwatchIsRunning}
                inputsAreReadOnly={anyStopwatchIsRunning}
                onChange={(params) =>
                  handleStopwatchChange({
                    ...params,
                    side: "left",
                  })
                }
              />
              {entry.activity?.hasSides && (
                <Stopwatch
                  label="Droite"
                  sx={{ flex: 1, width: "100%" }}
                  time={entry.rightTime}
                  isRunning={entry.rightStopwatchIsRunning}
                  lastUpdateTime={entry.rightStopwatchLastUpdateTime ?? null}
                  buttonIsDisabled={entry.leftStopwatchIsRunning}
                  // inputsAreDisabled={anyStopwatchIsRunning}
                  inputsAreReadOnly={anyStopwatchIsRunning}
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
              sx={{
                justifyContent: "space-between",
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
