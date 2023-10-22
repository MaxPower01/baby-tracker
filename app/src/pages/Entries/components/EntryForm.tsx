import {
  Alert,
  AlertColor,
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  InputLabel,
  LinearProgress,
  LinearProgressProps,
  MenuItem,
  Slide,
  Slider,
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
  jaJP,
} from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ActivityChip from "@/pages/Activities/components/ActivityChip";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import ActivityModel from "@/pages/Activities/models/ActivityModel";
import ActivityType from "@/pages/Activities/enums/ActivityType";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import EntryModel from "@/pages/Entries/models/EntryModel";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { PageId } from "@/enums/PageId";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import { Stopwatch } from "@/components/Stopwatch";
import SubActivityChip from "@/pages/Activities/components/SubActivityChip";
import { SubActivityModel } from "@/pages/Activities/models/SubActivityModel";
import { VolumeInput } from "@/components/VolumeInput";
import VolumeMenu from "@mui/material/Menu";
import dayjsLocaleFrCa from "@/lib/dayjs/dayjsLocaleFrCa";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import formatStopwatchesTime from "@/utils/formatStopwatchesTime";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import poopMarks from "@/utils/poopMarks";
import { storage } from "@/firebase";
import { updateEditingEntryId } from "@/pages/Entries/state/entriesSlice";
import urineMarks from "@/utils/urineMarks";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import useEntries from "@/pages/Entries/hooks/useEntries";
import { useMenu } from "@/components/Menu/hooks/useMenu";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

type EntryFormProps = {
  entry: EntryModel;
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

  const { user } = useAuthentication();

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

  // Handle date and time

  const handleStartTimeChange = (newStartTime: Dayjs | null) => {
    if (newStartTime == null) return;
    setEntry((prevEntry) => {
      const newEntry = prevEntry.clone();
      const newEntryStartDate = dayjs(newEntry.startDate)
        .hour(newStartTime.hour())
        .minute(newStartTime.minute());
      newEntry.startDate = newEntryStartDate.toDate();
      if (newEntry.anyStopwatchIsRunning) return newEntry;
      if (newEntry.activity?.hasSides == true) return newEntry;
      if (!newEntry.activity?.hasDuration) return newEntry;
      if (newEntry.endDate.getTime() < newEntry.startDate.getTime())
        return newEntry;
      const diff = newEntry.endDate.getTime() - newEntry.startDate.getTime();
      newEntry.leftTime = diff;
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
      if (newEntry.anyStopwatchIsRunning) return newEntry;
      if (newEntry.activity?.hasSides == true) return newEntry;
      if (!newEntry.activity?.hasDuration) return newEntry;
      if (newEntry.endDate.getTime() < newEntry.startDate.getTime())
        return newEntry;
      const diff = newEntry.endDate.getTime() - newEntry.startDate.getTime();
      newEntry.leftTime = diff;
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
      if (newEntry.anyStopwatchIsRunning) return newEntry;
      if (newEntry.activity?.hasSides == true) return newEntry;
      if (!newEntry.activity?.hasDuration) return newEntry;
      if (newEntry.endDate.getTime() < newEntry.startDate.getTime())
        return newEntry;
      const diff = newEntry.endDate.getTime() - newEntry.startDate.getTime();
      newEntry.leftTime = diff;
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
      if (newEntry.anyStopwatchIsRunning) return newEntry;
      if (newEntry.activity?.hasSides == true) return newEntry;
      if (!newEntry.activity?.hasDuration) return newEntry;
      if (newEntry.endDate.getTime() < newEntry.startDate.getTime())
        return newEntry;
      const diff = newEntry.endDate.getTime() - newEntry.startDate.getTime();
      newEntry.leftTime = diff;
      return newEntry;
    });
    setEndDateWasEditedManually(true);
    setHasPendingChanges(true);
  };

  const startTimeLabel = useMemo(() => {
    if (!entry.startDate) return "";
    const time =
      entry.startDate.getMilliseconds() +
      entry.startDate.getSeconds() * 1000 +
      entry.startDate.getMinutes() * 60 * 1000 +
      entry.startDate.getHours() * 60 * 60 * 1000;
    return formatStopwatchTime(time, true, false);
  }, [entry.startDate]);

  const endTimeLabel = useMemo(() => {
    if (!entry.endDate) return "";
    const time =
      entry.endDate.getMilliseconds() +
      entry.endDate.getSeconds() * 1000 +
      entry.endDate.getMinutes() * 60 * 1000 +
      entry.endDate.getHours() * 60 * 60 * 1000;
    return formatStopwatchTime(time, true, false);
  }, [entry.endDate]);

  // Handle poop/pee quantity if it's a diaper entry

  const [poopValue, setPoopValue] = useState(
    entryId == null
      ? props.entry.poopValue
      : entries.find((e) => e.id === entryId)?.poopValue ?? 0
  );

  const [urineValue, setUrineValue] = useState(
    entryId == null
      ? props.entry.urineValue
      : entries.find((e) => e.id === entryId)?.urineValue ?? 0
  );

  const poopLabel = useMemo(() => {
    if (poopValue === 0) return poopMarks[0].label ?? "";
    return (
      poopMarks.find((m) => m.value === Math.ceil(poopValue / 25) * 25)
        ?.label ?? ""
    );
  }, [poopValue]);

  const handlePoopChange = useCallback(
    (event: any, newValue: number | number[]) => {
      if (typeof newValue === "number") {
        setPoopValue(newValue);
        if (newValue > 0) {
          if (
            !entry.linkedActivities
              .map((a) => a.type)
              .includes(ActivityType.Poop)
          ) {
            toggleLinkedActivity(new ActivityModel(ActivityType.Poop));
          }
        }
        if (newValue === 0) {
          if (
            entry.linkedActivities
              .map((a) => a.type)
              .includes(ActivityType.Poop)
          ) {
            toggleLinkedActivity(new ActivityModel(ActivityType.Poop));
          }
        }
      }
    },
    [entry.linkedActivities]
  );

  const urineLabel = useMemo(() => {
    if (urineValue === 0) return urineMarks[0].label ?? "";
    return (
      urineMarks.find((m) => m.value === Math.ceil(urineValue / 25) * 25)
        ?.label ?? ""
    );
  }, [urineValue]);

  const handleUrineChange = useCallback(
    (event: any, newValue: number | number[]) => {
      if (typeof newValue === "number") {
        setUrineValue(newValue);
        if (newValue > 0) {
          if (
            !entry.linkedActivities
              .map((a) => a.type)
              .includes(ActivityType.Urine)
          ) {
            toggleLinkedActivity(new ActivityModel(ActivityType.Urine));
          }
        }
        if (newValue === 0) {
          if (
            entry.linkedActivities
              .map((a) => a.type)
              .includes(ActivityType.Urine)
          ) {
            toggleLinkedActivity(new ActivityModel(ActivityType.Urine));
          }
        }
      }
    },
    [entry.linkedActivities]
  );

  // Handle linked/sub activities

  const toggleLinkedActivity = useCallback(
    (subActivity: ActivityModel) => {
      let poopLinkedActivityWasToggledOn = false;
      let urineLinkedActivityWasToggledOn = false;
      let poopLinkedActivityWasToggledOff = false;
      let urineLinkedActivityWasToggledOff = false;
      setEntry((prevEntry) => {
        const newEntry = prevEntry.clone();
        if (
          newEntry.linkedActivities
            .map((a) => a.type)
            .includes(subActivity.type)
        ) {
          newEntry.linkedActivities = newEntry.linkedActivities.filter(
            (a) => a.type !== subActivity.type
          );
          if (subActivity.type == ActivityType.Poop) {
            poopLinkedActivityWasToggledOff = true;
          }
          if (subActivity.type == ActivityType.Urine) {
            urineLinkedActivityWasToggledOff = true;
          }
        } else {
          newEntry.linkedActivities.push(subActivity);
          if (subActivity.type == ActivityType.Poop) {
            poopLinkedActivityWasToggledOn = true;
          }
          if (subActivity.type == ActivityType.Urine) {
            urineLinkedActivityWasToggledOn = true;
          }
        }
        newEntry.linkedActivities = newEntry.linkedActivities.filter(
          (a, index, self) => self.findIndex((b) => b.type === a.type) === index
        );
        // save(newEntry);
        return newEntry;
      });
      if (poopValue == 0 && poopLinkedActivityWasToggledOn) {
        setPoopValue(50);
      } else if (urineValue == 0 && urineLinkedActivityWasToggledOn) {
        setUrineValue(50);
      } else if (poopValue > 0 && poopLinkedActivityWasToggledOff) {
        setPoopValue(0);
      } else if (urineValue > 0 && urineLinkedActivityWasToggledOff) {
        setUrineValue(0);
      }
      setHasPendingChanges(true);
    },
    [poopValue, urineValue]
  );

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

  // Handle stopwatches

  const anyStopwatchIsRunning = useMemo(() => {
    return entry.leftStopwatchIsRunning || entry.rightStopwatchIsRunning;
  }, [entry]);

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([entry.leftTime, entry.rightTime], false);
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

  // Handle notes

  const [note, setNote] = useState(
    entryId == null
      ? props.entry.note
      : entries.find((e) => e.id === entryId)?.note ?? props.entry.note ?? ""
  );

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNote = event.target.value;
    setNote(newNote);
    setHasPendingChanges(true);
  };

  // Handle images upload

  const [imageURLs, setImageURLs] = useState<string[]>(
    entryId == null
      ? props.entry.imageURLs
      : entries.find((e) => e.id === entryId)?.imageURLs ??
          props.entry.imageURLs ??
          []
  );
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const uploadImage = useCallback(
    async (image: File) => {
      const selectedChild = user?.selectedChild ?? "";
      if (image == null || isNullOrWhiteSpace(selectedChild)) return;
      const storageRef = ref(
        storage,
        `child/${selectedChild}/images/${image.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, image);
      setImageUploadProgress(0);
      setImageIsUploading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setImageUploadProgress(progress);
        },
        (error) => {
          // Error function ...
          console.error(error);
          setImageIsUploading(false);
        },
        () => {
          // Complete function ...
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("File available at", downloadURL);
              setImageURLs((prevImageUrls) => {
                const newImageUrls = [...prevImageUrls, downloadURL];
                return newImageUrls;
              });
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setImageIsUploading(false);
              setImageUploadProgress(0);
            });
        }
      );
    },
    [user]
  );

  const handleImageInputClick = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (imageIsUploading) return;
      if (event.target.files == null || event.target.files.length === 0) return;
      const image = event.target.files[0];
      await uploadImage(image);
      setHasPendingChanges(true);
    },
    [imageIsUploading, user, uploadImage]
  );

  // Handle size

  // Represents the size in millimeters
  const [size, setSize] = useState(
    entryId == null
      ? props.entry.length
      : entries.find((e) => e.id === entryId)?.length ?? props.entry.length ?? 0
  );

  const centimeters = useMemo(() => {
    if (size == null || isNaN(size) || size === 0) return 0;
    // Make sure that it's no more than 2 decimal places
    return Math.round((size / 10) * 100) / 100;
  }, [size]);

  const inches = useMemo(() => {
    if (size == null || isNaN(size) || size === 0) return 0;
    // Make sure that it's no more than 2 decimal places
    return Math.round((size / 25.4) * 100) / 100;
  }, [size]);

  const handleCentimetersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newCentimeters = 0;
    try {
      newCentimeters = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing centimeters: ", error);
    }
    setSize(newCentimeters * 10);
    setHasPendingChanges(true);
  };

  const handleInchesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newInches = 0;
    try {
      newInches = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing inches: ", error);
    }
    setSize(newInches * 25.4);
    setHasPendingChanges(true);
  };

  // Handle weight

  // Represents the weight in grams
  const [weight, setWeight] = useState(
    entryId == null
      ? props.entry.weight
      : entries.find((e) => e.id === entryId)?.weight ?? props.entry.weight ?? 0
  );

  const kilograms = useMemo(() => {
    if (weight == null || isNaN(weight) || weight === 0) return 0;
    // Make sure that it's no more than 2 decimal places
    return Math.round((weight / 1000) * 100) / 100;
  }, [weight]);

  const pounds = useMemo(() => {
    if (weight == null || isNaN(weight) || weight === 0) return 0;
    // Make sure that it's no more than 2 decimal places
    return Math.round((weight / 453.592) * 100) / 100;
  }, [weight]);

  const handleKilogramsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newKilograms = 0;
    try {
      newKilograms = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing kilograms: ", error);
    }
    setWeight(newKilograms * 1000);
    setHasPendingChanges(true);
  };

  const handlePoundsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newPounds = 0;
    try {
      newPounds = parseFloat(event.target.value);
    } catch (error) {
      console.error("Error parsing pounds: ", error);
    }
    setWeight(newPounds * 453.592);
    setHasPendingChanges(true);
  };

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
        entryToSave.weight = weight;
        entryToSave.length = size;
        entryToSave.imageURLs = imageURLs;
        entryToSave.poopValue = poopValue;
        entryToSave.urineValue = urineValue;
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
    [
      entry,
      user,
      entryId,
      note,
      weight,
      size,
      endDateWasEditedManually,
      imageURLs,
      poopValue,
      urineValue,
    ]
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
        // if (!endDateWasEditedManually) {
        newEntry.setEndDate();
        // }
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

  // Handle form submission

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
  }, [entry, user, entryId, handleSave, isSaving, hasPendingChanges, note]);

  return (
    <>
      <SectionStack>
        <Section>
          {entry.activity != null && (
            <Stack justifyContent={"center"} alignItems={"center"}>
              <ActivityIcon
                activity={entry.activity}
                sx={{
                  fontSize: "4em",
                }}
              />
              <Stack direction={"row"} alignItems={"center"}>
                <Typography variant="h4" textAlign="center" fontWeight={600}>
                  {entry.activity?.name}
                </Typography>
              </Stack>
            </Stack>
          )}

          {(subActivitiesTypes?.length ?? 0) > 0 && (
            <Box
              sx={{
                width: "100%",
                overflowX: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                alignItems={"flex-start"}
                onClick={(e) => {}}
                gap={1}
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
              </Stack>
            </Box>
          )}
          {(entry.activity?.linkedTypes?.length ?? 0) > 0 && (
            <Box
              sx={{
                width: "100%",
                overflowX: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Stack
                direction={"row"}
                onClick={(e) => {}}
                justifyContent={"flex-start"}
                alignItems={"flex-start"}
                gap={1}
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
              </Stack>
            </Box>
          )}
        </Section>

        {entry.activity?.hasVolume == true && (
          <Section dividerPosition={undefined}>
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
                  color={theme.customPalette.text.primary}
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

        <Section dividerPosition={undefined}>
          <Stack
            sx={{
              width: "100%",
            }}
          >
            <Stack
              spacing={0.5}
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
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={1}
                sx={{
                  width: "100%",
                }}
              >
                <Typography
                  variant="caption"
                  color={theme.customPalette.text.secondary}
                  sx={{
                    flexShrink: 0,
                  }}
                >
                  {entry.activity?.hasDuration == true
                    ? "Date de début"
                    : "Date"}
                </Typography>

                <Stack>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={dayjsLocaleFrCa as any}
                  >
                    <MobileDatePicker
                      value={dayjs(entry.startDate)}
                      onChange={handleStartDateChange}
                      disabled={anyStopwatchIsRunning}
                      // disableFuture={true}
                      // label={
                      //   entry.activity?.hasDuration == true
                      //     ? "Date de début"
                      //     : "Date"
                      // }
                      // sx={{
                      //   flex: 1,
                      // }}
                      slotProps={{
                        textField: {
                          sx: {
                            // flex:
                            //   entry.activity?.hasDuration == true ? 1 : undefined,
                            "& input": {
                              // width: "100%",
                              cursor: "pointer",
                              // textAlign:
                              //   entry.activity?.hasDuration == true
                              //     ? undefined
                              //     : "center",
                              padding: 0,
                              paddingRight: 1,
                              textAlign: "right",
                              fontSize: "0.9rem",
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

                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    {/* <Typography
                      textAlign="center"
                      variant="body1"
                      fontWeight={600}
                      textTransform={"none"}
                      color={
                        anyStopwatchIsRunning
                          ? theme.customPalette.text.secondary
                          : theme.customPalette.text.primary
                      }
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        transform: "translate(0, -50%)",
                        paddingRight: 1,
                      }}
                    >
                      {startTimeLabel}
                    </Typography> */}

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
                        format="HH:mm"
                        slotProps={{
                          textField: {
                            sx: {
                              // flex:
                              //   entry.activity?.hasDuration == true
                              //     ? 1
                              //     : undefined,
                              "& input": {
                                // opacity: "0 !important",
                                // width: "100%",
                                padding: 0,
                                paddingRight: 1,
                                cursor: "pointer",
                                // textAlign:
                                //   entry.activity?.hasDuration == true
                                //     ? undefined
                                //     : "center",
                                textAlign: "right",
                                fontSize: "1.35rem",
                                fontWeight: 500,
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
                  </Box>
                </Stack>
              </Stack>

              {entry.activity?.hasDuration == true && (
                <>
                  <Divider />
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    gap={1}
                    alignItems={"center"}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color={theme.customPalette.text.secondary}
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      Durée
                    </Typography>

                    <Stack>
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
                            variant="h6"
                            fontWeight={600}
                            textTransform={"none"}
                            color={
                              anyStopwatchIsRunning
                                ? theme.customPalette.text.secondary
                                : theme.customPalette.text.primary
                            }
                          >
                            {stopWatchTimeLabel}
                          </Typography>
                        </Button>
                      </Box>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    gap={1}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color={theme.customPalette.text.secondary}
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      Date de fin
                    </Typography>

                    <Stack>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale={dayjsLocaleFrCa as any}
                      >
                        <MobileDatePicker
                          value={dayjs(entry.endDate)}
                          onChange={handleEndDateChange}
                          disabled={anyStopwatchIsRunning}
                          // disableFuture={true}
                          // label="Date de fin"
                          // sx={{
                          //   flex: 1,
                          // }}
                          slotProps={{
                            textField: {
                              sx: {
                                // flex: 1,
                                textAlign: "right",
                                // "& label": {
                                //   width: "133%",
                                //   textAlign: "right",
                                // },
                                "& input": {
                                  // width: "100%",
                                  padding: 0,
                                  paddingRight: 1,
                                  cursor: "pointer",
                                  textAlign: "right",
                                  fontSize: "0.9rem",
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

                      <Box
                        sx={{
                          position: "relative",
                        }}
                      >
                        {/* <Typography
                          textAlign="center"
                          variant="body1"
                          fontWeight={600}
                          textTransform={"none"}
                          color={
                            anyStopwatchIsRunning
                              ? theme.customPalette.text.secondary
                              : theme.customPalette.text.primary
                          }
                          sx={{
                            position: "absolute",
                            top: "50%",
                            right: 0,
                            transform: "translate(0, -50%)",
                            paddingRight: 1,
                          }}
                        >
                          {endTimeLabel}
                        </Typography> */}

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
                            // sx={{
                            //   flex: 1,
                            // }}
                            format="HH:mm"
                            slotProps={{
                              textField: {
                                sx: {
                                  // flex: 1,
                                  textAlign: "right",
                                  // "& label": {
                                  //   width: "133%",
                                  //   textAlign: "right",
                                  // },
                                  "& input": {
                                    // width: "100%",
                                    // opacity: "0 !important",
                                    padding: 0,
                                    paddingRight: 1,
                                    cursor: "pointer",
                                    textAlign: "right",
                                    fontSize: "1.35rem",
                                    fontWeight: 500,
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
                      </Box>
                    </Stack>
                  </Stack>
                </>
              )}
            </Stack>
          </Stack>
        </Section>

        {entry.activity?.hasDuration == true && (
          <Section>
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

        {entry.activity?.hasLength == true && (
          <Section dividerPosition={undefined}>
            {/* <SectionTitle title="Longueur" /> */}
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={2}
            >
              <TextField
                label="Centimètres"
                name="cm"
                type="number"
                value={centimeters}
                onChange={handleCentimetersChange}
                fullWidth
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
              <TextField
                label="Pouces"
                name="inches"
                type="number"
                value={inches}
                onChange={handleInchesChange}
                fullWidth
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
            </Stack>
          </Section>
        )}

        {entry.activity?.hasWeight == true && (
          <Section dividerPosition={undefined}>
            {/* <SectionTitle title="Poids" /> */}
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={2}
            >
              <TextField
                label="Kg"
                name="weight"
                type="number"
                value={kilograms}
                onChange={handleKilogramsChange}
                fullWidth
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

              <TextField
                label="Lbs"
                name="weight"
                type="number"
                value={pounds}
                onChange={handlePoundsChange}
                fullWidth
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
            </Stack>
          </Section>
        )}

        {entry.activity?.type == ActivityType.Diaper && (
          <Stack
            spacing={1}
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                spacing={1}
              >
                <ActivityIcon
                  activity={new ActivityModel(ActivityType.Poop)}
                  sx={{
                    fontSize: "2rem",
                  }}
                />
                <Typography
                  id="poop-slider"
                  textAlign={"center"}
                  variant="body1"
                  color={
                    poopValue == 0
                      ? theme.customPalette.text.secondary
                      : theme.customPalette.text.primary
                  }
                >
                  {poopLabel}
                </Typography>
              </Stack>
              <Slider
                value={poopValue}
                onChange={handlePoopChange}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="off"
                aria-labelledby="poop-slider"
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                spacing={1}
              >
                <ActivityIcon
                  activity={new ActivityModel(ActivityType.Urine)}
                  sx={{
                    fontSize: "2rem",
                  }}
                />
                <Typography
                  id="poop-slider"
                  textAlign={"center"}
                  variant="body1"
                  color={
                    urineValue == 0
                      ? theme.customPalette.text.secondary
                      : theme.customPalette.text.primary
                  }
                >
                  {urineLabel}
                </Typography>
              </Stack>
              <Slider
                value={urineValue}
                onChange={handleUrineChange}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="off"
                aria-labelledby="urine-slider"
              />
            </Box>
          </Stack>
        )}

        <Section dividerPosition={undefined}>
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

        <Section dividerPosition={undefined}>
          <SectionTitle title="Images" />
          {(imageURLs?.length ?? 0) > 0 && (
            <ImageList>
              {imageURLs.map((imageURL, index) => {
                return (
                  <ImageListItem
                    key={`${index}-${imageURL}`}
                    sx={{
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <img src={`${imageURL}`} loading="lazy" />
                  </ImageListItem>
                );
              })}
            </ImageList>
          )}
          {imageIsUploading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgressWithLabel value={imageUploadProgress} />
            </Box>
          )}
          <input
            id="entry-form-image-upload"
            type="file"
            accept="image/*"
            multiple={true}
            onChange={async (e) => await handleImageInputClick(e)}
            style={{ display: "none" }}
          />
          <label htmlFor="entry-form-image-upload">
            <Button
              variant="outlined"
              onClick={() => {
                if (document && document.getElementById) {
                  const input = document.getElementById(
                    "entry-form-image-upload"
                  );
                  if (input) {
                    input.click();
                  }
                }
              }}
            >
              Ajouter une image
            </Button>
          </label>
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
