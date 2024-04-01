import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { entryTypeHasStopwatch } from "@/pages/Entry/utils/entryTypeHasStopwatch";
import { entryTypeHasVolume } from "@/pages/Entry/utils/entryTypeHasVolume";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { formatVolume } from "@/utils/formatVolume";

export function getActivityChipLabel(entries: Entry[]) {
  if (entries.length === 0) {
    return "";
  }
  let result = `${entries.length}x`;
  const entryType = entries[0].entryTypeId;
  let volumeIsDisplayed = false;
  if (entryTypeHasVolume(entryType)) {
    const totalVolume = entries.reduce((acc, entry) => {
      return acc + (entry.leftVolume ?? 0) + (entry.rightVolume ?? 0);
    }, 0);
    if (totalVolume > 0) {
      result += ` • ${formatVolume(totalVolume)} ml`;
      volumeIsDisplayed = true;
    }
  }
  if (entryTypeHasStopwatch(entryType) && !volumeIsDisplayed) {
    const totalTime = entries.reduce((acc, entry) => {
      return acc + (entry.leftTime ?? 0) + (entry.rightTime ?? 0);
    }, 0);
    if (totalTime > 0) {
      const totalDuration = formatStopwatchTime(totalTime);
      result += ` • ${totalDuration}`;
    }
  }
  return result;
}
