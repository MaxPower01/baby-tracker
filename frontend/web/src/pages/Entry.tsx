import { Divider, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import localeFrCa from "dayjs/locale/fr-ca";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useLayout from "../common/hooks/useLayout";
import { ActivityType } from "../lib/enums";
import { formatStopwatchesTime, isValidActivityType } from "../lib/utils";
import ActivityIcon from "../modules/activities/components/ActivityIcon";
import { Activity } from "../modules/activities/models/Activity";
import Stopwatch from "../modules/stopwatch/components/Stopwatch";

export default function Entry() {
  const layout = useLayout();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Check if it's a new entry or an existing one

  const isNewEntry = useMemo(() => !params.entryId, [params.entryId]);

  useEffect(() => {
    if (isNewEntry) {
      layout.setShouldRenderDeleteButton(false);
    } else {
      layout.setShouldRenderDeleteButton(true);
    }
    return () => {
      layout.setShouldRenderDeleteButton(false);
    };
  }, [isNewEntry]);

  // Get the activity

  const activity = useMemo(() => {
    const activityType = searchParams.get("activity");
    if (isValidActivityType(activityType)) {
      return new Activity(Number(activityType) as ActivityType);
    } else {
      return null;
    }
  }, [searchParams]);

  // Handle the start date and time

  const [value, setValue] = useState<Dayjs | null>(dayjs());

  // Handle the stopwatches

  const [leftStopwatchTimeInSeconds, setLeftStopWatchTimeInSeconds] =
    useState<number>(0);
  const [rightStopwatchTimeInSeconds, setRightStopWatchTimeInSeconds] =
    useState<number>(0);

  const [leftStopWatchIsRunning, setLeftStopWatchIsRunning] =
    useState<boolean>(false);
  const [rightStopWatchIsRunning, setRightStopWatchIsRunning] =
    useState<boolean>(false);

  const anyStopwatchIsRunning = useMemo(
    () => leftStopWatchIsRunning || rightStopWatchIsRunning,
    [leftStopWatchIsRunning, rightStopWatchIsRunning]
  );

  const stopWatchTimeLabel = useMemo(() => {
    return formatStopwatchesTime([
      leftStopwatchTimeInSeconds,
      rightStopwatchTimeInSeconds,
    ]);
  }, [leftStopwatchTimeInSeconds, rightStopwatchTimeInSeconds]);

  return (
    <>
      {activity && (
        <Stack
          spacing={4}
          alignItems="center"
          sx={{
            width: "100%",
          }}
        >
          <Stack
            component={"section"}
            alignItems="center"
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <Section>
              <ActivityIcon
                activity={activity}
                sx={{
                  fontSize: "150%",
                }}
              />
              <Typography variant="h4" textAlign="center">
                {activity.name}
              </Typography>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={localeFrCa}
              >
                <MobileDateTimePicker
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
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
          </Stack>

          {activity?.hasDuration && (
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
                  timeInSeconds={leftStopwatchTimeInSeconds}
                  setTimeInSeconds={setLeftStopWatchTimeInSeconds}
                  isRunning={leftStopWatchIsRunning}
                  setIsRunning={setLeftStopWatchIsRunning}
                  isDisabled={rightStopWatchIsRunning}
                  label={activity.hasSides ? "Gauche" : undefined}
                  sx={{ flex: 1 }}
                />
                {activity.hasSides && (
                  <Stopwatch
                    timeInSeconds={rightStopwatchTimeInSeconds}
                    setTimeInSeconds={setRightStopWatchTimeInSeconds}
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
            <Typography>À faire</Typography>
          </Section>
        </Stack>
      )}
    </>
  );
}

function Section(props: {
  children: React.ReactNode;
  dividerPosition?: "top" | "bottom";
}) {
  return (
    <>
      {props.dividerPosition === "top" && <Divider sx={{ width: "100%" }} />}

      <Stack
        component={"section"}
        alignItems="center"
        spacing={2}
        sx={{
          width: "100%",
        }}
      >
        {props.children}
      </Stack>

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
