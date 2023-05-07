import ActivityType from "@/modules/activities/enums/ActivityType";
import Entries from "@/modules/entries/components/Entries";
import { selectLastFeedingEntry } from "@/modules/entries/state/entriesSlice";
import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function HomePage() {
  const lastFeedingEntry = useSelector(selectLastFeedingEntry);
  const lastFeedingWarning = useMemo(() => {
    if (lastFeedingEntry == null) return null;
    const now = new Date();
    const lastFeedingDate = lastFeedingEntry?.endDate.toDate();
    if (lastFeedingDate == null) return null;
    const diff = now.getTime() - lastFeedingDate.getTime();
    const diffInHours = diff / (1000 * 3600);
    const diffInMinutes = diff / (1000 * 60);
    if (diffInMinutes < 1) return null;
    if (lastFeedingEntry.activity?.type == ActivityType.BreastFeeding) {
      let result = "Dernier allaitement terminé il y a ";
      if (diffInHours >= 1) {
        result += Math.floor(diffInHours) + " heures et ";
      }
      result += Math.floor(diffInMinutes % 60) + " minutes";
      return result;
    } else if (lastFeedingEntry.activity?.type == ActivityType.BottleFeeding) {
      let result = "Dernier biberon terminé il y a ";
      if (diffInHours >= 1) {
        result += Math.floor(diffInHours) + " heures et ";
      }
      result += Math.floor(diffInMinutes % 60) + " minutes";
      return result;
    }
    return null;
  }, [lastFeedingEntry]);
  return (
    <Stack spacing={4}>
      {lastFeedingWarning != null && (
        <Typography
          variant="body1"
          fontStyle={"italic"}
          sx={{
            opacity: 0.8,
          }}
        >
          {lastFeedingWarning}
        </Typography>
      )}
      <Entries />
    </Stack>
  );
}
