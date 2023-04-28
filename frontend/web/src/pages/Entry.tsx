import { Divider, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import dayjs from "dayjs";
import localeFrCa from "dayjs/locale/fr-ca";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useLayout from "../common/hooks/useLayout";
import { ActivityType } from "../lib/enums";
import { isValidActivityType } from "../lib/utils";
import ActivityIcon from "../modules/activities/components/ActivityIcon";
import { Activity } from "../modules/activities/models/Activity";
import StopWatch from "../modules/stopwatch/components/StopWatch";

export default function Entry() {
  /* -------------------------------------------------------------------------- */
  /*                                    Setup                                   */
  /* -------------------------------------------------------------------------- */

  const layout = useLayout();

  const { entryId } = useParams();
  const isNewEntry = useMemo(() => !entryId, [entryId]);

  const [searchParams, setSearchParams] = useSearchParams();
  const activityType = searchParams.get("activity");
  const activity = useMemo(() => {
    if (isValidActivityType(activityType)) {
      return new Activity(Number(activityType) as ActivityType);
    } else {
      return null;
    }
  }, [activityType]);

  const shouldDisplayOneStopWatch = useMemo(() => {
    return activity && activity.hasDuration && !activity.hasSides;
  }, [activity]);

  const shouldDisplayTwoStopWatches = useMemo(() => {
    return activity && activity.hasDuration && activity.hasSides;
  }, [activity]);

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

  const [startDateTime, setStartDateTime] = useState<Date>(new Date());
  const [stopDateTime, setStopDateTime] = useState<Date>(new Date());
  const [durationInSeconds, setDurationInSeconds] = useState<number | null>(
    null
  );
  const durationLabel = useMemo(() => {
    if (durationInSeconds === null) {
      return "00:00";
    }
    const minutes = Math.floor(durationInSeconds / 60);
    let minutesLabel = minutes.toString();
    if (minutes < 10) {
      minutesLabel = `0${minutesLabel}`;
    }
    const seconds = durationInSeconds % 60;
    let secondsLabel = seconds.toString();
    if (seconds < 10) {
      secondsLabel = `0${secondsLabel}`;
    }
    return `${minutesLabel}:${secondsLabel}`;
  }, [durationInSeconds]);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

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
            </Section>
          </Stack>

          <Divider sx={{ width: "100%" }} />

          <Section>
            <SectionTitle title="Durée" />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={localeFrCa}
            >
              <MobileDateTimePicker
                label="Départ"
                defaultValue={dayjs("2022-04-17T15:30")}
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
            <Typography textAlign="center" variant="h4">
              {durationLabel}
            </Typography>
            <Stack
              direction={"row"}
              sx={{
                width: "100%",
              }}
            >
              <StopWatch
                label={activity.hasSides ? "Gauche" : undefined}
                sx={{ flex: 1 }}
              />
              {activity.hasSides && (
                <StopWatch label="Droite" sx={{ flex: 1 }} />
              )}
            </Stack>
          </Section>

          <Divider sx={{ width: "100%" }} />

          <Stack
            component={"section"}
            alignItems="center"
            spacing={2}
            sx={{
              width: "100%",
            }}
          >
            <SectionTitle title="Notes" />
            <Typography>À faire</Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
}

function Section(props: { children: React.ReactNode }) {
  return (
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
