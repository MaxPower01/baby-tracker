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
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextPicker } from "@/pages/Activity/components/ActivityContextPicker";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { CustomBottomBar } from "@/components/CustomBottomBar";
import { DateTimePicker } from "@/components/DateTimePicker";
import { DateTimeRangePicker } from "@/components/DateTimeRangePicker";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { ImagesInput } from "@/components/ImagesInput";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { NasalHygieneId } from "@/enums/NasalHygieneId";
import { NasalHygieneTypesPicker } from "@/components/NasalHygieneTypesPicker";
import { NotesInput } from "@/components/NotesInput";
import { PageId } from "@/enums/PageId";
import { PoopAmountPicker } from "@/components/PoopAmountPicker";
import { PoopColor } from "@/types/PoopColor";
import { PoopColorId } from "@/enums/PoopColorId";
import PoopColorPicker from "@/components/PoopColorPicker";
import { PoopTextureId } from "@/enums/PoopTextureId";
import { PoopTexturePicker } from "@/components/PoopTexturePicker";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import { SizeInput } from "@/components/SizeInput";
import { StopwatchContainer } from "@/components/StopwatchContainer";
import { StopwatchTimePicker } from "@/components/StopwatchTimePicker";
import { TemperatureInput } from "@/components/TemperatureInput";
import { TemperatureMethodId } from "@/enums/TemperatureMethodId";
import { TemperatureMethodPicker } from "@/components/TemperatureMethodPicker";
import { Timestamp } from "firebase/firestore";
import UrineAmountSelector from "@/components/UrineAmountSelector";
import { VolumeInput } from "@/components/VolumeInput";
import VolumeInputContainer from "@/components/VolumeInputContainer";
import { WeightInput } from "@/components/WeightInput";
import { computeEndDate } from "@/pages/Entry/utils/computeEndDate";
import { entryTypeHasContextSelector } from "@/pages/Entry/utils/entryTypeHasContextSelector";
import { entryTypeHasNasalHygiene } from "@/pages/Entry/utils/entryTypeHasNasalHygiene";
import { entryTypeHasPoop } from "@/pages/Entry/utils/entryTypeHasPoop";
import { entryTypeHasSides } from "@/pages/Entry/utils/entryTypeHasSides";
import { entryTypeHasSize } from "@/pages/Entry/utils/entryTypeHasSize";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasTemperature } from "@/pages/Entry/utils/entryTypeHasTemperature";
import { entryTypeHasUrine } from "@/pages/Entry/utils/entryTypeHasUrine";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { entryTypeHasWeight } from "@/pages/Entry/utils/entryTypeHasWeight";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getEntryTime } from "@/pages/Entry/utils/getEntryTime";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
import { getTimestamp } from "@/utils/getTimestamp";
import { parseEnumValue } from "@/utils/parseEnumValue";
import { saveEntryInDB } from "@/state/slices/entriesSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useLayout } from "@/components/LayoutProvider";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/components/SnackbarProvider";

type EntryFormProps = {
  entry: Entry;
};

export default function EntryForm(props: EntryFormProps) {
  const layout = useLayout();
  useEffect(() => {
    layout.setBottomBarVisibility("hidden");
    return () => {
      layout.setBottomBarVisibility("visible");
    };
  }, []);
  const { user } = useAuthentication();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const name = getEntryTypeName(props.entry.entryTypeId);
  const [selectedActivityContexts, setSelectedActivityContexts] = useState<
    ActivityContext[]
  >([]);
  const initialStartDate = getDateFromTimestamp(props.entry.startTimestamp);
  const initialEndDate = getDateFromTimestamp(props.entry.endTimestamp);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs(initialStartDate));
  const [startTime, setStartTime] = useState<Dayjs>(dayjs(initialStartDate));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(initialEndDate));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs(initialEndDate));
  const startDateTime = useMemo(() => {
    const date = startDate.toDate();
    const time = startTime.toDate();
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());
    return date;
  }, [startDate, startTime]);
  const endDateTime = useMemo(() => {
    const date = endDate.toDate();
    const time = endTime.toDate();
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());
    return date;
  }, [endDate, endTime]);
  const [note, setNote] = useState(props.entry.note);
  const [imageURLs, setImageURLs] = useState<string[]>(props.entry.imageURLs);
  const [isUploading, setIsUploading] = useState(false);
  const [weight, setWeight] = useState(props.entry.weight ?? 0);
  const [size, setSize] = useState(props.entry.size ?? 0);
  const [leftTime, setLeftTime] = useState(
    getEntryTime(props.entry, "left", true)
  );
  const [rightTime, setRightTime] = useState(
    getEntryTime(props.entry, "right", true)
  );
  const handleStopwatchTimeChange = useCallback(
    (side: "left" | "right", time: React.SetStateAction<number> | number) => {
      let totalTime = typeof time === "number" ? time : 0;
      if (side === "left") {
        setLeftTime(time);
        totalTime += rightTime;
      } else {
        setRightTime(time);
        totalTime += leftTime;
      }
      const newEndDateTime = computeEndDate(startDateTime, totalTime);
      setEndDate(dayjs(newEndDateTime));
      setEndTime(dayjs(newEndDateTime));
    },
    [startDateTime, leftTime, rightTime]
  );
  const [leftStopwatchIsRunning, setLeftStopwatchIsRunning] = useState(
    props.entry.leftStopwatchIsRunning
  );
  const [rightStopwatchIsRunning, setRightStopwatchIsRunning] = useState(
    props.entry.rightStopwatchIsRunning
  );
  const handleStopwatchIsRunningChange = useCallback(
    (
      side: "left" | "right",
      isRunning: React.SetStateAction<boolean> | boolean
    ) => {
      if (side === "left") {
        setLeftStopwatchIsRunning(isRunning);
      } else {
        setRightStopwatchIsRunning(isRunning);
      }
    },
    [leftStopwatchIsRunning, rightStopwatchIsRunning]
  );
  const stopwatchIsRunning = useMemo(
    () => leftStopwatchIsRunning || rightStopwatchIsRunning,
    [leftStopwatchIsRunning, rightStopwatchIsRunning]
  );
  const [leftStopwatchLastUpdateTime, setLeftStopwatchLastUpdateTime] =
    useState<number | null>(null);
  const [rightStopwatchLastUpdateTime, setRightStopwatchLastUpdateTime] =
    useState<number | null>(null);
  const handleStopwatchLastUpdateTimeChange = useCallback(
    (
      side: "left" | "right",
      lastUpdateTime: React.SetStateAction<number | null> | number | null
    ) => {
      if (side === "left") {
        setLeftStopwatchLastUpdateTime(
          typeof lastUpdateTime === "number" ? lastUpdateTime : null
        );
      } else {
        setRightStopwatchLastUpdateTime(
          typeof lastUpdateTime === "number" ? lastUpdateTime : null
        );
      }
    },
    [leftStopwatchLastUpdateTime, rightStopwatchLastUpdateTime]
  );
  const lastStopwatchUpdateTime = useMemo(
    () =>
      leftStopwatchLastUpdateTime && rightStopwatchLastUpdateTime
        ? Math.max(leftStopwatchLastUpdateTime, rightStopwatchLastUpdateTime)
        : leftStopwatchLastUpdateTime ?? rightStopwatchLastUpdateTime,
    [leftStopwatchLastUpdateTime, rightStopwatchLastUpdateTime]
  );
  const [temperature, setTemperature] = useState(props.entry.temperature ?? 0);
  const [leftVolume, setLeftVolume] = useState(props.entry.leftVolume ?? 0);
  const [rightVolume, setRightVollume] = useState(props.entry.rightVolume ?? 0);
  const volume = useMemo(
    () => leftVolume + rightVolume,
    [leftVolume, rightVolume]
  );
  const [urineAmount, setUrineAmount] = useState(props.entry.urineAmount ?? 0);
  const [poopAmount, setPoopAmount] = useState(props.entry.poopAmount ?? 0);
  const [poopConsistencyId, setPoopConsistencyId] =
    useState<PoopTextureId | null>(props.entry.poopTextureId);
  const [poopColorId, setPoopColorId] = useState<PoopColorId | null>(
    props.entry.poopColorId
  );
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(() => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (isSaving || user == null) {
          return resolve(false);
        }
        setIsSaving(true);
        const entry: Entry = {
          id: props.entry.id,
          babyId: props.entry.babyId,
          entryTypeId: props.entry.entryTypeId,
          startTimestamp: getTimestamp(startDateTime),
          endTimestamp: getTimestamp(endDateTime),
          note: note,
          imageURLs: imageURLs,
          activityContexts: selectedActivityContexts,
          leftVolume: leftVolume,
          rightVolume: rightVolume,
          weight: weight,
          size: size,
          temperature: temperature,
          leftTime: leftTime,
          leftStopwatchIsRunning: leftStopwatchIsRunning,
          leftStopwatchLastUpdateTime: leftStopwatchLastUpdateTime,
          rightTime: rightTime,
          rightStopwatchIsRunning: rightStopwatchIsRunning,
          rightStopwatchLastUpdateTime: rightStopwatchLastUpdateTime,
          urineAmount: urineAmount,
          poopAmount: poopAmount,
          poopColorId: poopColorId,
          poopTextureId: poopConsistencyId,
          createdTimestamp: props.entry.createdTimestamp,
          editedTimestamp: props.entry.editedTimestamp,
          createdBy: user.uid,
          editedBy: props.entry.editedBy,
        };
        await dispatch(saveEntryInDB({ entry, user })).unwrap();
        setIsSaving(false);
        return resolve(true);
      } catch (error) {
        setIsSaving(false);
        showSnackbar({
          id: "save-entry-error",
          isOpen: true,
          message:
            "Une erreur s'est produite lors de l'enregistrement de l'entrée.",
          severity: "error",
        });
        return reject(error);
      }
    });
  }, [
    startDateTime,
    endDateTime,
    note,
    imageURLs,
    selectedActivityContexts,
    leftVolume,
    rightVolume,
    weight,
    size,
    temperature,
    leftTime,
    leftStopwatchIsRunning,
    rightTime,
    rightStopwatchIsRunning,
    urineAmount,
    poopAmount,
    poopColorId,
    poopConsistencyId,
    isSaving,
    user,
  ]);

  const handleSubmit = useCallback(() => {
    save()
      .then((success) => {
        if (success) {
          navigate(
            getPath({
              page: PageId.Home,
            })
          );
        }
      })
      .catch((error) => {
        console.error("Error saving entry", error);
      });
  }, [
    startDateTime,
    endDateTime,
    note,
    imageURLs,
    selectedActivityContexts,
    leftVolume,
    rightVolume,
    weight,
    size,
    temperature,
    leftTime,
    leftStopwatchIsRunning,
    rightTime,
    rightStopwatchIsRunning,
    urineAmount,
    poopAmount,
    poopColorId,
    poopConsistencyId,
    isSaving,
    save,
    user,
  ]);

  return (
    <>
      <Stack
        spacing={4}
        alignItems="center"
        sx={{
          width: "100%",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          sx={{
            width: "100%",
          }}
        >
          <Section title="header">
            <Stack justifyContent={"center"} alignItems={"center"}>
              <ActivityIcon
                type={props.entry.entryTypeId}
                sx={{
                  fontSize: "5em",
                }}
              />
              <Stack direction={"row"} alignItems={"center"}>
                <Typography variant="h5" textAlign="center">
                  {name}
                </Typography>
              </Stack>
            </Stack>
          </Section>

          {entryTypeHasStopwatch(props.entry.entryTypeId) ? (
            <Section title="range">
              <DateTimeRangePicker
                startDate={startDate}
                setStartDate={setStartDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endDate={endDate}
                setEndDate={setEndDate}
                endTime={endTime}
                setEndTime={setEndTime}
              />
            </Section>
          ) : (
            <Section title="date">
              <DateTimePicker
                layout="row"
                iconPostion="left"
                align="left"
                date={startDate}
                setDate={setStartDate}
                time={startTime}
                setTime={setStartTime}
              />
            </Section>
          )}
        </Stack>

        {entryTypeHasContextSelector(props.entry.entryTypeId) && (
          <Section title="context">
            <ActivityContextPicker
              entryType={props.entry.entryTypeId}
              selectedItems={selectedActivityContexts}
              setSelectedItems={setSelectedActivityContexts}
            />
          </Section>
        )}

        {entryTypeHasTemperature(props.entry.entryTypeId) && (
          <Section title="temperature">
            <SectionTitle title="Température" />
            <TemperatureInput value={temperature} setValue={setTemperature} />
          </Section>
        )}

        {entryTypeHasVolume(props.entry.entryTypeId) && (
          <Section title="volume">
            <SectionTitle title="Quantité" />
            <VolumeInputContainer
              hasSides={entryTypeHasSides(props.entry.entryTypeId)}
              leftValue={leftVolume}
              setLeftValue={setLeftVolume}
              rightValue={rightVolume}
              setRightValue={setRightVollume}
            />
          </Section>
        )}

        {entryTypeHasWeight(props.entry.entryTypeId) && (
          <Section title="weight">
            <WeightInput value={weight} setValue={setWeight} />
          </Section>
        )}

        {entryTypeHasSize(props.entry.entryTypeId) && (
          <Section title="size">
            <SizeInput value={size} setValue={setSize} />
          </Section>
        )}

        {entryTypeHasUrine(props.entry.entryTypeId) && (
          <Section title="urine">
            {/* {parseEnumValue(props.entry.entryType, EntryType) !=
              EntryType.Urine && <SectionTitle title="Pipi" />} */}
            <UrineAmountSelector
              value={urineAmount}
              setValue={setUrineAmount}
            />
          </Section>
        )}

        {entryTypeHasPoop(props.entry.entryTypeId) && (
          <Section title="poop">
            {/* {parseEnumValue(props.entry.entryType, EntryType) !=
              EntryType.Poop && <SectionTitle title="Caca" />} */}
            <PoopAmountPicker value={poopAmount} setValue={setPoopAmount} />
            {poopAmount > 0 && (
              <PoopTexturePicker
                value={poopConsistencyId}
                setValue={setPoopConsistencyId}
              />
            )}
            {poopAmount > 0 && (
              <PoopColorPicker value={poopColorId} setValue={setPoopColorId} />
            )}
          </Section>
        )}

        {entryTypeHasStopwatch(props.entry.entryTypeId) && (
          <Section title="stopwatch">
            <SectionTitle title="Durée" />
            <StopwatchContainer
              size="big"
              hasSides={entryTypeHasSides(props.entry.entryTypeId)}
              leftTime={leftTime}
              setLeftTime={(time) => handleStopwatchTimeChange("left", time)}
              rightTime={rightTime}
              setRightTime={(time) => handleStopwatchTimeChange("right", time)}
              leftIsRunning={leftStopwatchIsRunning}
              setLeftIsRunning={(isRunning) =>
                handleStopwatchIsRunningChange("left", isRunning)
              }
              rightIsRunning={rightStopwatchIsRunning}
              setRightIsRunning={(isRunning) =>
                handleStopwatchIsRunningChange("right", isRunning)
              }
              leftLastUpdateTime={leftStopwatchLastUpdateTime}
              setLeftLastUpdateTime={(lastUpdateTime) =>
                handleStopwatchLastUpdateTimeChange("left", lastUpdateTime)
              }
              rightLastUpdateTime={rightStopwatchLastUpdateTime}
              setRightLastUpdateTime={(lastUpdateTime) =>
                handleStopwatchLastUpdateTimeChange("right", lastUpdateTime)
              }
            />
          </Section>
        )}

        <Section title="notes">
          <SectionTitle title="Notes" />
          <NotesInput note={note} setNote={setNote} />
        </Section>

        <Section title="images">
          <SectionTitle title="Images" />
          <ImagesInput
            imageUrls={imageURLs}
            setImageUrls={setImageURLs}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </Section>
      </Stack>

      <CustomBottomBar
        onSaveButtonClick={handleSubmit}
        saveButtonDisabled={isSaving}
      />
    </>
  );
}
