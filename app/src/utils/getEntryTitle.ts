import { Entry } from "@/pages/Entry/types/Entry";
import { entryTypeHasSides } from "@/pages/Entry/utils/entryTypeHasSides";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import { getEntryTypeName } from "./getEntryTypeName";

export function getEntryTitle(entry: Entry): string {
  let title = getEntryTypeName(entry.entryTypeId);
  let titleSuffix: "left" | "right" | null = null;
  if (entryTypeHasSides(entry.entryTypeId)) {
    if (entryTypeHasVolume(entry.entryTypeId)) {
      const hasLeftVolume = entry.leftVolume != null;
      const hasRightVolume = entry.rightVolume != null;
      const hasBothVolume = hasLeftVolume && hasRightVolume;
      if (!hasBothVolume) {
        titleSuffix = hasLeftVolume ? "left" : "right";
      }
    } else if (entryTypeHasStopwatch(entry.entryTypeId)) {
      const hasLeftTime = entry.leftTime != null;
      const hasRightTime = entry.rightTime != null;
      const hasBothTime = hasLeftTime && hasRightTime;
      if (!hasBothTime) {
        titleSuffix = hasLeftTime ? "left" : "right";
      }
    }
  }
  if (titleSuffix != null) {
    title += ` (${titleSuffix === "left" ? "G" : "D"})`;
  }
  return title;
}
