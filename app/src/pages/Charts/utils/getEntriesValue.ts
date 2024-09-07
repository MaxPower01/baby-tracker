import { Entry } from "@/pages/Entry/types/Entry";

export function getEntriesValue(entries: Entry[], yAxisType: string) {
  if (yAxisType === "count") {
    return entries.length;
  } else if (yAxisType === "duration") {
    // Calculate total time for both sides
    const result = entries.reduce(
      (acc, entry) => acc + (entry.leftTime ?? 0) + (entry.rightTime ?? 0),
      0
    );
    return result > 0 ? result / 1000 / 60 : result; // Convert to minutes
  } else if (yAxisType === "volume") {
    return entries.reduce(
      (acc, entry) => acc + (entry.leftVolume ?? 0) + (entry.rightVolume ?? 0),
      0
    );
  }
  return 0;
}
