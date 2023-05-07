import { formatStopwatchTime } from "@/lib/utils";
import ActivityType from "@/modules/activities/enums/ActivityType";
import { selectLastFeedingEntry } from "@/modules/entries/state/entriesSlice";
import { Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function LastFeedingWarning() {
  const lastFeedingEntry = useSelector(selectLastFeedingEntry);
  const [forceUpdate, setForceUpdate] = useState(1);
  const lastFeedingWarning = useMemo(() => {
    if (lastFeedingEntry == null) return null;
    let side: "gauche" | "droit" | null = null;
    let time = lastFeedingEntry.time;
    if (lastFeedingEntry.leftTime > 0 && lastFeedingEntry.rightTime == 0) {
      side = "gauche";
    } else if (
      lastFeedingEntry.leftTime == 0 &&
      lastFeedingEntry.rightTime > 0
    ) {
      side = "droit";
    }
    const now = new Date();
    const lastFeedingDate = lastFeedingEntry?.startDate.toDate();
    if (lastFeedingDate == null) return null;
    const diff = now.getTime() - lastFeedingDate.getTime();
    const diffInHours = diff / (1000 * 3600);
    const diffInMinutes = diff / (1000 * 60);
    if (diffInMinutes < 1) return null;
    if (lastFeedingEntry.activity?.type == ActivityType.BreastFeeding) {
      let result = "Dernier allaitement : ";
      result += "Il y a ";
      if (diffInHours >= 1) {
        result += Math.floor(diffInHours) + " heures et ";
      }
      result += Math.floor(diffInMinutes % 60) + " minutes";
      if (side != null) {
        result += ` • Côté ${side} • Durée de ${formatStopwatchTime(
          lastFeedingEntry.time,
          true
        )}`;
      } else {
        result += ` • Durée de ${formatStopwatchTime(
          lastFeedingEntry.time,
          true
        )}`;
      }
      return result;
    } else if (lastFeedingEntry.activity?.type == ActivityType.BottleFeeding) {
      let result = "Dernier biberon : ";
      result += "Il y a ";
      if (diffInHours >= 1) {
        result += Math.floor(diffInHours) + " heures et ";
      }
      result += Math.floor(diffInMinutes % 60) + " minutes";
      if (lastFeedingEntry.time > 0) {
        result += ` • Durée de ${formatStopwatchTime(
          lastFeedingEntry.time,
          true
        )}`;
      }
      if (lastFeedingEntry.volume > 0) {
        result += ` • Volume de ${lastFeedingEntry.volume} ml`;
      }
      return result;
    }
    return null;
  }, [lastFeedingEntry, forceUpdate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setForceUpdate((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (lastFeedingWarning == null) return null;

  return (
    <Typography
      variant="body1"
      fontStyle={"italic"}
      sx={{
        opacity: 0.8,
      }}
    >
      {lastFeedingWarning}
    </Typography>
  );
}
