import { Entry } from "@/pages/Entry/types/Entry";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getTimestamp } from "@/utils/getTimestamp";

type ElapsedTimeResult = {
  label: string;
  seconds: number;
};

export function getTimeElapsedSinceLastEntry(entry: Entry): ElapsedTimeResult {
  const now = new Date();
  const previous = getDateFromTimestamp(entry.startTimestamp);
  const diff = now.getTime() - previous.getTime();
  const diffInSeconds = Math.floor(diff / 1000);
  if (diffInSeconds < 60) {
    return {
      label: "À l'instant",
      seconds: diffInSeconds,
    };
  }
  return {
    label: `Il y a ${formatStopwatchTime(diff, true, false)}`,
    seconds: diffInSeconds,
  };
}
