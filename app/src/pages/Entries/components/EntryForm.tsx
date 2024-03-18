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
import { useCallback, useMemo, useState } from "react";

import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { ActivityContextPicker } from "@/pages/Activity/components/ActivityContextPicker";
import { ActivityContextType } from "@/pages/Activity/enums/ActivityContextType";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { DateTimePicker } from "@/components/DateTimePicker";
import { DateTimeRangePicker } from "@/components/DateTimeRangePicker";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { ImagesInput } from "@/components/ImagesInput";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { NasalHygieneType } from "@/enums/NasalHygieneType";
import { NasalHygieneTypesPicker } from "@/components/NasalHygieneTypesPicker";
import { NotesInput } from "@/components/NotesInput";
import { PoopAmountPicker } from "@/components/PoopAmountPicker";
import { Section } from "@/components/Section";
import { SectionStack } from "@/components/SectionStack";
import { SectionTitle } from "@/components/SectionTitle";
import { SizeInput } from "@/components/SizeInput";
import { StopwatchContainer } from "@/components/StopwatchContainer";
import { TemperatureInput } from "@/components/TemperatureInput";
import { TemperatureMethod } from "@/enums/TemperatureMethod";
import { TemperatureMethodPicker } from "@/components/TemperatureMethodPicker";
import UrineAmountSelector from "@/components/UrineAmountSelector";
import { VolumeInput } from "@/components/VolumeInput";
import VolumeInputContainer from "@/components/VolumeInputContainer";
import { WeightInput } from "@/components/WeightInput";
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
import { getTitleForEntryType } from "@/utils/utils";
import { parseEnumValue } from "@/utils/parseEnumValue";

type EntryFormProps = {
  entry: Entry;
};

export default function EntryForm(props: EntryFormProps) {
  const theme = useTheme();
  const name = getTitleForEntryType(props.entry.entryType);
  const handleSubmit = useCallback(() => {}, []);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedActivityContexts, setSelectedActivityContexts] = useState<
    ActivityContext[]
  >([]);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [startTime, setStartTime] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs>(dayjs());
  const [note, setNote] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [weight, setWeight] = useState(0);
  const [size, setSize] = useState(0);
  const [leftStopwatchTime, setLeftStopwatchTime] = useState(0);
  const [rightStopwatchTime, setRightStopwatchTime] = useState(0);
  const stopwatchTime = useMemo(
    () => leftStopwatchTime + rightStopwatchTime,
    [leftStopwatchTime, rightStopwatchTime]
  );
  const [leftStopwatchIsRunning, setLeftStopwatchIsRunning] = useState(false);
  const [rightStopwatchIsRunning, setRightStopwatchIsRunning] = useState(false);
  const stopwatchIsRunning = useMemo(
    () => leftStopwatchIsRunning || rightStopwatchIsRunning,
    [leftStopwatchIsRunning, rightStopwatchIsRunning]
  );
  const [leftStopwatchLastUpdateTime, setLeftStopwatchLastUpdateTime] =
    useState<number | null>(null);
  const [rightStopwatchLastUpdateTime, setRightStopwatchLastUpdateTime] =
    useState<number | null>(null);
  const lastStopwatchUpdateTime = useMemo(
    () =>
      leftStopwatchLastUpdateTime && rightStopwatchLastUpdateTime
        ? Math.max(leftStopwatchLastUpdateTime, rightStopwatchLastUpdateTime)
        : leftStopwatchLastUpdateTime ?? rightStopwatchLastUpdateTime,
    [leftStopwatchLastUpdateTime, rightStopwatchLastUpdateTime]
  );
  const [temperature, setTemperature] = useState(0);
  const [temperatureMethod, setTemperatureMethod] =
    useState<TemperatureMethod | null>(null);
  const [nasalHygieneTypes, setNasalHygieneTypes] = useState<
    NasalHygieneType[]
  >([]);
  const [leftVollume, setLeftVollume] = useState(0);
  const [rightVollume, setRightVollume] = useState(0);
  const volume = useMemo(
    () => leftVollume + rightVollume,
    [leftVollume, rightVollume]
  );
  const [urineAmount, setUrineAmount] = useState(0);
  const [poopAmount, setPoopAmount] = useState(0);

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
                type={props.entry.entryType}
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

          {entryTypeHasStopwatch(props.entry.entryType) ? (
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

        {entryTypeHasContextSelector(props.entry.entryType) && (
          <Section title="context">
            <ActivityContextPicker
              entryType={props.entry.entryType}
              selectedItems={selectedActivityContexts}
              setSelectedItems={setSelectedActivityContexts}
            />
          </Section>
        )}

        {entryTypeHasTemperature(props.entry.entryType) && (
          <>
            <Section title="temperature-method">
              <TemperatureMethodPicker
                value={temperatureMethod}
                setValue={setTemperatureMethod}
              />
            </Section>

            <Section title="temperature">
              <SectionTitle title="Température" />
              <TemperatureInput value={temperature} setValue={setTemperature} />
            </Section>
          </>
        )}

        {entryTypeHasNasalHygiene(props.entry.entryType) && (
          <Section title="nasal-hygiene">
            <NasalHygieneTypesPicker
              values={nasalHygieneTypes}
              setValues={setNasalHygieneTypes}
            />
          </Section>
        )}

        {entryTypeHasVolume(props.entry.entryType) && (
          <Section title="volume">
            <SectionTitle title="Quantité" />
            <VolumeInputContainer
              hasSides={entryTypeHasSides(props.entry.entryType)}
              leftValue={leftVollume}
              setLeftValue={setLeftVollume}
              rightValue={rightVollume}
              setRightValue={setRightVollume}
            />
          </Section>
        )}

        {entryTypeHasWeight(props.entry.entryType) && (
          <Section title="weight">
            <WeightInput value={weight} setValue={setWeight} />
          </Section>
        )}

        {entryTypeHasSize(props.entry.entryType) && (
          <Section title="size">
            <SizeInput value={size} setValue={setSize} />
          </Section>
        )}

        {entryTypeHasUrine(props.entry.entryType) && (
          <Section title="urine">
            {parseEnumValue(props.entry.entryType, EntryType) !=
              EntryType.Urine && <SectionTitle title="Pipi" />}
            <UrineAmountSelector
              value={urineAmount}
              setValue={setUrineAmount}
            />
          </Section>
        )}

        {entryTypeHasPoop(props.entry.entryType) && (
          <Section title="poop">
            {parseEnumValue(props.entry.entryType, EntryType) !=
              EntryType.Poop && <SectionTitle title="Caca" />}
            <PoopAmountPicker value={poopAmount} setValue={setPoopAmount} />
          </Section>
        )}

        {entryTypeHasStopwatch(props.entry.entryType) && (
          <Section title="stopwatch">
            <SectionTitle title="Durée" />
            <StopwatchContainer
              size="big"
              hasSides={entryTypeHasSides(props.entry.entryType)}
              leftTime={leftStopwatchTime}
              setLeftTime={setLeftStopwatchTime}
              rightTime={rightStopwatchTime}
              setRightTime={setRightStopwatchTime}
              leftIsRunning={leftStopwatchIsRunning}
              setLeftIsRunning={setLeftStopwatchIsRunning}
              rightIsRunning={rightStopwatchIsRunning}
              setRightIsRunning={setRightStopwatchIsRunning}
              leftLastUpdateTime={leftStopwatchLastUpdateTime}
              setLeftLastUpdateTime={setLeftStopwatchLastUpdateTime}
              rightLastUpdateTime={rightStopwatchLastUpdateTime}
              setRightLastUpdateTime={setRightStopwatchLastUpdateTime}
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
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </Section>
      </Stack>

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
    </>
  );
}
