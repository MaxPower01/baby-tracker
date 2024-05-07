import { Entry } from "@/pages/Entry/types/Entry";

export function getEntryTime(
  entry: Entry,
  side?: "left" | "right",
  upToDate?: boolean
): number {
  if (!side) {
    return (
      getEntryTime(entry, "left", upToDate) +
      getEntryTime(entry, "right", upToDate)
    );
  }
  if (side === "left") {
    if (upToDate && entry.leftStopwatchIsRunning) {
      const now = Date.now();
      const delta = now - (entry.leftStopwatchLastUpdateTime || now);
      const roundedDelta = Math.round(delta / 1000) * 1000;
      return (entry.leftTime ?? 0) + roundedDelta;
    }
    return entry.leftTime ?? 0;
  } else if (side === "right") {
    if (upToDate && entry.rightStopwatchIsRunning) {
      const now = Date.now();
      const delta = now - (entry.rightStopwatchLastUpdateTime || now);
      const roundedDelta = Math.round(delta / 1000) * 1000;
      return (entry.rightTime ?? 0) + roundedDelta;
    }
    return entry.rightTime ?? 0;
  }
  return 0;
}
