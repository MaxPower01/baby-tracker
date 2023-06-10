import {
  Alert,
  AlertColor,
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Slide,
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
} from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import {
  formatStopwatchesTime,
  getPath,
  isNullOrWhiteSpace,
} from "@/utils/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ActivityChip from "@/modules/activities/components/ActivityChip";
import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import EntryModel from "@/modules/entries/models/EntryModel";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import PageId from "@/common/enums/PageId";
import Section from "@/common/components/Section";
import SectionStack from "@/common/components/SectionStack";
import SectionTitle from "@/common/components/SectionTitle";
import Stopwatch from "@/modules/stopwatch/components/Stopwatch";
import SubActivityChip from "@/modules/activities/components/SubActivityChip";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import VolumeInput from "@/modules/volume/components/VolumeInput";
import VolumeMenu from "@mui/material/Menu";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import { updateEditingEntryId } from "@/modules/entries/state/entriesSlice";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useEntries from "@/modules/entries/hooks/useEntries";
import useMenu from "@/modules/menu/hooks/useMenu";

type EntryFormProps = {
  entry: EntryModel;
  isEditing?: boolean;
  shouldStartTimer?: "left" | "right";
};

export default function EntryForm(props: EntryFormProps) {
  const { entryId: paramsEntryId } = useParams();
  const [entryId, setEntryId] = useState<string | undefined>(paramsEntryId);
  const { entries, saveEntry } = useEntries();
  const {
    Menu: StopwatchMenu,
    openMenu: openStopwatchMenu,
    closeMenu: closeStopwatchMenu,
  } = useMenu();

  const [hasPendingChanges, setHasPendingChanges] = useState(true); // To ensure that a new entry is saved even without any changes
  const [isSaving, setIsSaving] = useState(false);

  const [note, setNote] = useState(
    entryId == null
      ? props.entry.note
      : entries.find((e) => e.id === entryId)?.note ?? props.entry.note ?? ""
  );

  const [volumeMenuAnchorEl, setVolumeMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const volumeMenuOpen = Boolean(volumeMenuAnchorEl);

  const handleVolumeMenuClose = () => {
    setVolumeMenuAnchorEl(null);
  };

  const [entry, setEntry] = useState<EntryModel>(
    entryId == null
      ? props.entry
      : entries.find((e) => e.id === entryId) ?? props.entry
  );
  const [endDateWasEditedManually, setEndDateWasEditedManually] =
    useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    AlertColor | undefined
  >(undefined);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // if (reason === "clickaway") {
    //   return;
    // }
    setSnackbarIsOpen(false);
  };

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
    if (entry.id) dispatch(updateEditingEntryId(entry.id));
  }, [entry]);

  // const save = useCallback(
  //   (entry: EntryModel) => {
  //     dispatch(updateEntry({ id: entry.id, entry: entry.serialize() }));
  //   },
  //   [dispatch, entry]
  // );

  // Handle the date and time

  const handleStartTimeChange = (newStartTime: Dayjs | null) => {
    if (newStartTime == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      const newEntryStartDate = dayjs(newEntry.startDate)
        .hour(newStartTime.hour())
        .minute(newStartTime.minute());
      newEntry.startDate = newEntryStartDate.toDate();
      return newEntry;
    });
    setHasPendingChanges(true);
  };

  const handleEndTimeChange = (newEndTime: Dayjs | null) => {
    if (newEndTime == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      const newEntryEndDate = dayjs(newEntry.endDate)
        .hour(newEndTime.hour())
        .minute(newEndTime.minute());
      newEntry.endDate = newEntryEndDate.toDate();
      return newEntry;
    });
    setEndDateWasEditedManually(true);
    setHasPendingChanges(true);
  };

  const handleStartDateChange = (newStartDate: Dayjs | null) => {
    if (newStartDate == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      const newEntryStartDate = dayjs(newEntry.startDate)
        .year(newStartDate.year())
        .month(newStartDate.month())
        .date(newStartDate.date());
      newEntry.startDate = newEntryStartDate.toDate();
      return newEntry;
    });
    setHasPendingChanges(true);
  };

  const handleEndDateChange = (newEndDate: Dayjs | null) => {
    if (newEndDate == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      const newEntryEndDate = dayjs(newEntry.endDate)
        .year(newEndDate.year())
        .month(newEndDate.month())
        .date(newEndDate.date());
      newEntry.endDate = newEntryEndDate.toDate();
      return newEntry;
    });
    setEndDateWasEditedManually(true);
    setHasPendingChanges(true);
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
    setHasPendingChanges(true);
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
    setHasPendingChanges(true);
  };

  const linkedActivities = useMemo(() => {
    return entry.linkedActivities;
  }, [entry]);

  const subActivities = useMemo(() => {
    return entry.subActivities;
  }, [entry]);

  const subActivitiesTypes = useMemo(() => {
    if (entry.activity == null) return [];
    let result = entry.activity.subTypes.map((subType) => {
      return subType;
    });
    return result.filter((subType, index, self) => {
      return self.findIndex((s) => s === subType) === index;
    });
  }, [entry]);

  // Handle the stopwatches

  const anyStopwatchIsRunning = useMemo(() => {
    return entry.leftStopwatchIsRunning || entry.rightStopwatchIsRunning;
  }, [entry]);

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([entry.leftTime, entry.rightTime], true);
  }, [entry]);

  const leftStopwatchPlayPauseButtonId =
    "entryFormLeftStopwatchPlayPauseButton";
  const leftStopwatchEditButtonId = "entryFormLeftStopwatchEditButton";
  const rightStopwatchPlayPauseButtonId =
    "entryFormRightStopwatchPlayPauseButton";
  const rightStopwatchEditButtonId = "entryFormRightStopwatchEditButton";

  const triggerEditOnLeftStopwatch = (e: React.MouseEvent) => {
    const leftStopwatchEditButton = document.getElementById(
      leftStopwatchEditButtonId
    );
    if (leftStopwatchEditButton != null) {
      leftStopwatchEditButton.click();
    }
  };

  const triggerEditOnRightStopwatch = (e: React.MouseEvent) => {
    const rightStopwatchEditButton = document.getElementById(
      rightStopwatchEditButtonId
    );
    if (rightStopwatchEditButton != null) {
      rightStopwatchEditButton.click();
    }
  };

  const handleDurationClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (anyStopwatchIsRunning) {
        return;
      }
      const hasSides = entry.activity?.hasSides ?? false;
      if (hasSides) {
        openStopwatchMenu(e);
      } else {
        triggerEditOnLeftStopwatch(e);
      }
    },
    [entry, anyStopwatchIsRunning]
  );

  // Handle volume

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
    setHasPendingChanges(true);
  };

  const volumeLabel = useMemo(() => {
    const volume = entry.leftVolume + entry.rightVolume;
    return `${volume} ml`;
  }, [entry]);

  const leftVolumeButtonId = "entryFormLeftVolumeButton";
  const rightVolumeButtonId = "entryFormRightVolumeButton";

  const triggerEditOnLeftVolume = (e: React.MouseEvent) => {
    const leftVolumeButton = document.getElementById(leftVolumeButtonId);
    if (leftVolumeButton != null) {
      leftVolumeButton.click();
    }
  };

  const triggerEditOnRightVolume = (e: React.MouseEvent) => {
    const rightVolumeButton = document.getElementById(rightVolumeButtonId);
    if (rightVolumeButton != null) {
      rightVolumeButton.click();
    }
  };

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (anyStopwatchIsRunning) {
        return;
      }
      const hasSides = entry.activity?.hasSides ?? false;
      if (hasSides) {
        setVolumeMenuAnchorEl(e.currentTarget);
      } else {
        triggerEditOnLeftVolume(e);
      }
    },
    [entry, anyStopwatchIsRunning]
  );

  // Handle save

  const handleSave = useCallback(
    async (overrideEntry?: EntryModel) => {
      setIsSaving(true);
      const selectedChild = user?.selectedChild ?? "";
      const entryToSave = overrideEntry ?? entry;
      if (entryToSave?.id == null) {
        entryToSave.id = entryId ?? null;
      }
      try {
        if (user == null || isNullOrWhiteSpace(selectedChild)) {
          setSnackbarIsOpen(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Aucun enfant sélectionné");
          return false;
        }
        if (!endDateWasEditedManually) entryToSave.setEndDate();
        entryToSave.note = note;
        const id = await saveEntry(entryToSave);
        if (id != null) {
          setEntryId(id);
        }
        setIsSaving(false);
        setHasPendingChanges(false);
        return true;
        // setSnackbarIsOpened(true);
        // setSnackbarSeverity("success");
        // setSnackbarMessage("Entrée enregistrée");
      } catch (error) {
        setIsSaving(false);
        setSnackbarIsOpen(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Erreur lors de l'enregistrement de l'entrée");
        return false;
      }
    },
    [entry, user, children, entryId, note]
  );

  const handleStopwatchChange = useCallback(
    async (params: {
      side: string;
      time: number;
      isRunning: boolean;
      lastUpdateTime: number | null;
      isStartStop: boolean;
    }) => {
      let entryToSave: EntryModel | null = null;
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
        entryToSave = newEntry;
        return newEntry;
      });
      setHasPendingChanges(true);
      if (params.isStartStop && entryToSave != null) {
        await handleSave(entryToSave);
      }
    },
    [endDateWasEditedManually, handleSave]
  );

  useEffect(() => {
    if (props.shouldStartTimer != null) {
      if (props.shouldStartTimer === "left") {
        handleStopwatchChange({
          side: "left",
          time: 1,
          isRunning: true,
          lastUpdateTime: Date.now(),
          isStartStop: true,
        });
      } else if (props.shouldStartTimer === "right") {
        handleStopwatchChange({
          side: "right",
          time: 1,
          isRunning: true,
          lastUpdateTime: Date.now(),
          isStartStop: true,
        });
      }
    }
  }, []);

  // Handle the notes

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setEntry((prevEntry) => {
    //   const newEntry = prevEntry.clone();
    //   newEntry.note = event.target.value;
    //   // save(newEntry);
    //   return newEntry;
    // });
    setNote(event.target.value);
    setHasPendingChanges(true);
  };

  // Handle the form submission

  const handleSubmit = useCallback(async () => {
    if (isSaving) return;
    if (hasPendingChanges) {
      const success = await handleSave();
      if (success) {
        navigate(
          getPath({
            page: PageId.Home,
          })
        );
      }
    } else {
      navigate(
        getPath({
          page: PageId.Home,
        })
      );
    }
  }, [
    entry,
    user,
    children,
    entryId,
    handleSave,
    isSaving,
    hasPendingChanges,
    note,
  ]);

  return (
    <>
      <SectionStack>
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

          {(subActivitiesTypes?.length ?? 0) > 0 && (
            <Grid
              container
              gap={1}
              justifyContent="center"
              onClick={(e) => {
                // if (anyStopwatchIsRunning) {
                //   setSnackbarMessage(
                //     "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                //   );
                //   setSnackbarSeverity("info");
                //   setSnackbarIsOpen(true);
                // }
              }}
            >
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
                    // isDisabled={anyStopwatchIsRunning}
                  />
                );
              })}
            </Grid>
          )}
          {(entry.activity?.linkedTypes?.length ?? 0) > 0 && (
            <Grid
              container
              gap={1}
              justifyContent="center"
              onClick={(e) => {
                // if (anyStopwatchIsRunning) {
                //   setSnackbarMessage(
                //     "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                //   );
                //   setSnackbarSeverity("info");
                //   setSnackbarIsOpen(true);
                // }
              }}
            >
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
                    // isDisabled={anyStopwatchIsRunning}
                  />
                );
              })}
            </Grid>
          )}
        </Section>

        {entry.activity?.hasVolume == true && (
          <Section dividerPosition="top">
            <SectionTitle title="Quantité" />
            <Box
              onClick={(e) => {
                if (anyStopwatchIsRunning) {
                  setSnackbarMessage(
                    "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                  );
                  setSnackbarSeverity("info");
                  setSnackbarIsOpen(true);
                }
              }}
            >
              <Button
                variant="text"
                onClick={(e) => handleVolumeClick(e)}
                disabled={anyStopwatchIsRunning}
              >
                <Typography
                  textAlign="center"
                  variant="h4"
                  textTransform={"none"}
                  color={theme.palette.text.primary}
                >
                  {volumeLabel}
                </Typography>
              </Button>
            </Box>
            <Stack
              direction={"row"}
              justifyContent={"space-around"}
              spacing={4}
              sx={{
                width: "100%",
              }}
              onClick={(e) => {
                if (anyStopwatchIsRunning) {
                  setSnackbarMessage(
                    "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                  );
                  setSnackbarSeverity("info");
                  setSnackbarIsOpen(true);
                }
              }}
            >
              <VolumeInput
                buttonId={leftVolumeButtonId}
                volume={entry.leftVolume}
                onChange={({ volume }) =>
                  handleVolumeChange({ side: "left", newVolume: volume })
                }
                label={entry.activity?.hasSides ? "Gauche" : undefined}
                inputsAreDisabled={anyStopwatchIsRunning}
              />
              {entry.activity?.hasSides && (
                <VolumeInput
                  buttonId={rightVolumeButtonId}
                  volume={entry.rightVolume}
                  onChange={({ volume }) =>
                    handleVolumeChange({ side: "right", newVolume: volume })
                  }
                  label="Droite"
                  inputsAreDisabled={anyStopwatchIsRunning}
                />
              )}
              <VolumeMenu
                anchorEl={volumeMenuAnchorEl}
                open={volumeMenuOpen}
                onClose={handleVolumeMenuClose}
              >
                <MenuItem
                  onClick={(e) => {
                    handleVolumeMenuClose();
                    triggerEditOnLeftVolume(e);
                  }}
                >
                  Modifier le côté gauche
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    handleVolumeMenuClose();
                    triggerEditOnRightVolume(e);
                  }}
                >
                  Modifier le côté droit
                </MenuItem>
              </VolumeMenu>
            </Stack>
          </Section>
        )}
        <Section dividerPosition="top">
          <Stack
            sx={{
              width: "100%",
            }}
          >
            <Stack
              direction={"row"}
              justifyContent={"center"}
              sx={{
                width: "100%",
              }}
              onClick={(e) => {
                if (anyStopwatchIsRunning) {
                  setSnackbarMessage(
                    "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                  );
                  setSnackbarSeverity("info");
                  setSnackbarIsOpen(true);
                }
              }}
            >
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={dayjsLocaleFrCa as any}
              >
                <MobileDatePicker
                  value={dayjs(entry.startDate)}
                  onChange={handleStartDateChange}
                  disabled={anyStopwatchIsRunning}
                  // disableFuture={true}
                  label={
                    entry.activity?.hasDuration == true
                      ? "Date de début"
                      : "Date"
                  }
                  sx={{
                    flex: 1,
                  }}
                  slotProps={{
                    textField: {
                      sx: {
                        flex:
                          entry.activity?.hasDuration == true ? 1 : undefined,
                        "& input": {
                          width: "100%",
                          cursor: "pointer",
                          textAlign:
                            entry.activity?.hasDuration == true
                              ? undefined
                              : "center",
                        },
                        "& *:before": {
                          border: "none !important",
                        },
                      },
                      variant: "standard",
                      error: false,
                      helperText: "",
                    },
                  }}
                  localeText={{
                    toolbarTitle: "",
                    okButtonLabel: "OK",
                    cancelButtonLabel: "Annuler",
                    nextMonth: "Mois suivant",
                    previousMonth: "Mois précédent",
                  }}
                />
              </LocalizationProvider>
              {entry.activity?.hasDuration == true && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjsLocaleFrCa as any}
                >
                  <MobileDatePicker
                    value={dayjs(entry.endDate)}
                    onChange={handleEndDateChange}
                    disabled={anyStopwatchIsRunning}
                    // disableFuture={true}
                    label="Date de fin"
                    sx={{
                      flex: 1,
                    }}
                    slotProps={{
                      textField: {
                        sx: {
                          flex: 1,
                          textAlign: "right",
                          "& label": {
                            width: "133%",
                            textAlign: "right",
                          },
                          "& input": {
                            width: "100%",
                            cursor: "pointer",
                            textAlign: "right",
                          },
                          "& *:before": {
                            border: "none !important",
                          },
                        },
                        error: false,
                        variant: "standard",
                      },
                    }}
                    localeText={{
                      toolbarTitle: "",
                      okButtonLabel: "OK",
                      cancelButtonLabel: "Annuler",
                      nextMonth: "Mois suivant",
                      previousMonth: "Mois précédent",
                    }}
                  />
                </LocalizationProvider>
              )}
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              sx={{
                width: "100%",
              }}
              onClick={(e) => {
                if (anyStopwatchIsRunning) {
                  setSnackbarMessage(
                    "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                  );
                  setSnackbarSeverity("info");
                  setSnackbarIsOpen(true);
                }
              }}
            >
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={dayjsLocaleFrCa as any}
              >
                <MobileTimePicker
                  value={dayjs(entry.startDate)}
                  onChange={handleStartTimeChange}
                  disabled={anyStopwatchIsRunning}
                  sx={{
                    flex: 1,
                  }}
                  slotProps={{
                    textField: {
                      sx: {
                        flex:
                          entry.activity?.hasDuration == true ? 1 : undefined,
                        "& input": {
                          width: "100%",
                          cursor: "pointer",
                          textAlign:
                            entry.activity?.hasDuration == true
                              ? undefined
                              : "center",
                          fontSize: "1.35rem",
                        },
                        "& *:before": {
                          border: "none !important",
                        },
                      },
                      variant: "standard",
                      error: false,
                      helperText: "",
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
              {entry.activity?.hasDuration == true && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={dayjsLocaleFrCa as any}
                >
                  <MobileTimePicker
                    value={dayjs(entry.endDate)}
                    onChange={handleEndTimeChange}
                    disabled={anyStopwatchIsRunning}
                    // disableFuture={true}
                    // label="Date de fin"
                    sx={{
                      flex: 1,
                    }}
                    slotProps={{
                      textField: {
                        sx: {
                          flex: 1,
                          textAlign: "right",
                          "& label": {
                            width: "133%",
                            textAlign: "right",
                          },
                          "& input": {
                            width: "100%",
                            cursor: "pointer",
                            textAlign: "right",
                            fontSize: "1.35rem",
                          },
                          "& *:before": {
                            border: "none !important",
                          },
                        },
                        error: false,
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
              )}
            </Stack>
          </Stack>

          {entry.activity?.hasDuration == true && (
            <>
              <InputLabel>Durée</InputLabel>

              <Box
                onClick={(e) => {
                  if (anyStopwatchIsRunning) {
                    setSnackbarMessage(
                      "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                    );
                    setSnackbarSeverity("info");
                    setSnackbarIsOpen(true);
                  }
                }}
              >
                <Button
                  variant="text"
                  onClick={(e) => handleDurationClick(e)}
                  disabled={anyStopwatchIsRunning}
                >
                  <Typography
                    textAlign="center"
                    variant="h4"
                    textTransform={"none"}
                    color={theme.palette.text.primary}
                  >
                    {stopWatchTimeLabel}
                  </Typography>
                </Button>
              </Box>

              <Stack
                direction={"row"}
                spacing={4}
                sx={{
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    width: "100%",
                  }}
                  onClick={(e) => {
                    if (entry.rightStopwatchIsRunning) {
                      setSnackbarMessage(
                        "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                      );
                      setSnackbarSeverity("info");
                      setSnackbarIsOpen(true);
                    }
                  }}
                >
                  <Stopwatch
                    playPauseButtonId={leftStopwatchPlayPauseButtonId}
                    editButtonId={leftStopwatchEditButtonId}
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
                </Box>
                {entry.activity?.hasSides && (
                  <Box
                    sx={{
                      flex: 1,
                      width: "100%",
                    }}
                    onClick={(e) => {
                      if (entry.leftStopwatchIsRunning) {
                        setSnackbarMessage(
                          "Certaines modifications sont désactivées pendant que le chronomètre tourne."
                        );
                        setSnackbarSeverity("info");
                        setSnackbarIsOpen(true);
                      }
                    }}
                  >
                    <Stopwatch
                      playPauseButtonId={rightStopwatchPlayPauseButtonId}
                      editButtonId={rightStopwatchEditButtonId}
                      label="Droite"
                      sx={{ flex: 1, width: "100%" }}
                      time={entry.rightTime}
                      isRunning={entry.rightStopwatchIsRunning}
                      lastUpdateTime={
                        entry.rightStopwatchLastUpdateTime ?? null
                      }
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
                  </Box>
                )}
                <StopwatchMenu>
                  <MenuItem
                    onClick={(e) => {
                      closeStopwatchMenu(e);
                      triggerEditOnLeftStopwatch(e);
                    }}
                  >
                    Modifier le côté gauche
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      closeStopwatchMenu(e);
                      triggerEditOnRightStopwatch(e);
                    }}
                  >
                    Modifier le côté droit
                  </MenuItem>
                </StopwatchMenu>
              </Stack>
            </>
          )}
        </Section>

        <Section dividerPosition="top">
          <SectionTitle title="Notes" />
          <TextField
            label=""
            name="note"
            type="text"
            value={note}
            onChange={handleNoteChange}
            fullWidth
            multiline
            minRows={5}
            // disabled={anyStopwatchIsRunning}
            onClick={(e) => {
              // if (anyStopwatchIsRunning) {
              //   setSnackbarMessage(
              //     "Certaines modifications sont désactivées pendant que le chronomètre tourne."
              //   );
              //   setSnackbarSeverity("info");
              //   setSnackbarIsOpen(true);
              // }
            }}
          />
        </Section>
      </SectionStack>

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
              >
                Enregistrer
              </Button>
              {/* <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => navigate(getPath({ page: PageName.Home }))}
              >
                Retour à l'accueil
              </Button> */}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Snackbar
        open={snackbarIsOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="standard"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
