import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { Timestamp } from "firebase/firestore";
import { getTimestamp } from "@/utils/getTimestamp";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultEntry(
  entryType: string | null,
  babyId: string
): Entry | null {
  if (isNullOrWhiteSpace(entryType) || typeof entryType !== "string") {
    return null;
  }
  const parsedEntryType = parseEnumValue(entryType, EntryTypeId);
  if (parsedEntryType === null) {
    return null;
  }
  const timestamp = getTimestamp(new Date());
  let result: Entry = {
    id: "",
    babyId: babyId,
    entryTypeId: parsedEntryType,
    activityContexts: [],
    startTimestamp: timestamp,
    endTimestamp: timestamp,
    imageURLs: [],
    note: "",
    leftStopwatchIsRunning: false,
    leftTime: null,
    leftVolume: null,
    rightStopwatchIsRunning: false,
    rightTime: null,
    rightVolume: null,
    poopAmount: null,
    poopColorId: null,
    poopTextureId: null,
    size: null,
    temperature: null,
    urineAmount: null,
    weight: null,
    leftStopwatchLastUpdateTime: null,
    rightStopwatchLastUpdateTime: null,
    poopHasUndigestedPieces: false,
  };
  return result;
}
