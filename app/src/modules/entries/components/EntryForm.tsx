import Section from "@/common/components/Section";
import SectionTitle from "@/common/components/SectionTitle";
import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import PageName from "@/common/enums/PageName";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import {
  formatStopwatchesTime,
  getPath,
  isNullOrWhiteSpace,
} from "@/lib/utils";
import ActivityChip from "@/modules/activities/components/ActivityChip";
import ActivityIcon from "@/modules/activities/components/ActivityIcon";
import SubActivityChip from "@/modules/activities/components/SubActivityChip";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import { SubActivityModel } from "@/modules/activities/models/SubActivityModel";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useEntries from "@/modules/entries/hooks/useEntries";
import EntryModel from "@/modules/entries/models/EntryModel";
import { setEditingEntryId } from "@/modules/entries/state/entriesSlice";
import useMenu from "@/modules/menu/hooks/useMenu";
import Stopwatch from "@/modules/stopwatch/components/Stopwatch";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import VolumeInput from "@/modules/volume/components/VolumeInput";
import {
  Alert,
  AlertColor,
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Slide,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import VolumeMenu from "@mui/material/Menu";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
      const selectedChild =
        children.find((child) => child.isSelected)?.id ??
        user?.selectedChild ??
        "";
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
        const id = await saveEntry(entryToSave);
        if (id != null) {
          setEntryId(id);
        }
        return true;
        // setSnackbarIsOpened(true);
        // setSnackbarSeverity("success");
        // setSnackbarMessage("Entrée enregistrée");
      } catch (error) {
        setSnackbarIsOpen(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Erreur lors de l'enregistrement de l'entrée");
        return false;
      }
    },
    [entry, user, children, entryId]
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
      if (params.isStartStop && entryToSave != null) {
        await handleSave(entryToSave);
      }
      // handleSubmit();
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
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      newEntry.note = event.target.value;
      // save(newEntry);
      return newEntry;
    });
  };

  // Handle the form submission

  const handleSubmit = useCallback(async () => {
    const success = await handleSave();
    if (success) {
      navigate(
        getPath({
          page: PageName.Home,
        })
      );
    }
  }, [entry, user, children]);

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
            onClick={(e) => {
              if (anyStopwatchIsRunning) {
                setSnackbarMessage(
                  "Les modifications sont désactivées pendant que le chronomètre tourne."
                );
                setSnackbarSeverity("info");
                setSnackbarIsOpen(true);
              }
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
                label={
                  entry.activity?.hasDuration == true ? "Date de début" : ""
                }
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
            {entry.activity?.hasDuration == true && (
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
            )}
          </Stack>
          {(subActivitiesTypes?.length ?? 0) > 0 && (
            <Grid
              container
              gap={1}
              justifyContent="center"
              onClick={(e) => {
                if (anyStopwatchIsRunning) {
                  setSnackbarMessage(
                    "Les modifications sont désactivées pendant que le chronomètre tourne."
                  );
                  setSnackbarSeverity("info");
                  setSnackbarIsOpen(true);
                }
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
                    isDisabled={anyStopwatchIsRunning}
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
                if (anyStopwatchIsRunning) {
                  setSnackbarMessage(
                    "Les modifications sont désactivées pendant que le chronomètre tourne."
                  );
                  setSnackbarSeverity("info");
                  setSnackbarIsOpen(true);
                }
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
            <Box
              onClick={(e) => {
                if (anyStopwatchIsRunning) {
                  setSnackbarMessage(
                    "Les modifications sont désactivées pendant que le chronomètre tourne."
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
                    "Les modifications sont désactivées pendant que le chronomètre tourne."
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
        {entry.activity?.hasDuration == true && (
          <Section dividerPosition="top">
            <SectionTitle title="Durée" />
            <Box
              onClick={(e) => {
                if (anyStopwatchIsRunning) {
                  setSnackbarMessage(
                    "Les modifications sont désactivées pendant que le chronomètre tourne."
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
                      "Les modifications sont désactivées pendant que le chronomètre tourne."
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
                        "Les modifications sont désactivées pendant que le chronomètre tourne."
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
            onClick={(e) => {
              if (anyStopwatchIsRunning) {
                setSnackbarMessage(
                  "Les modifications sont désactivées pendant que le chronomètre tourne."
                );
                setSnackbarSeverity("info");
                setSnackbarIsOpen(true);
              }
            }}
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
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
