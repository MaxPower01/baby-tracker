import { Entry } from "@/pages/Entry/types/Entry";

export function getEntriesValue(
  entries: Entry[],
  yAxisType: string,
  side?: "left" | "right"
) {
  if (yAxisType === "count") {
    return entries.length;
  }

  if (yAxisType === "duration") {
    const result = entries.reduce((acc, entry) => {
      if (side === "left") {
        return acc + (entry.leftTime ?? 0);
      }
      if (side === "right") {
        return acc + (entry.rightTime ?? 0);
      }
      return acc + (entry.leftTime ?? 0) + (entry.rightTime ?? 0);
    }, 0);

    return result > 0 ? result / 1000 / 60 : result; // Convert to minutes
  }

  if (yAxisType === "volume") {
    return entries.reduce((acc, entry) => {
      if (side === "left") {
        return acc + (entry.leftVolume ?? 0);
      }
      if (side === "right") {
        return acc + (entry.rightVolume ?? 0);
      }
      return acc + (entry.leftVolume ?? 0) + (entry.rightVolume ?? 0);
    }, 0);
  }

  return 0;
}
