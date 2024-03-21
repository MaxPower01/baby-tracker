import { Entry } from "@/pages/Entry/types/Entry";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { Timestamp } from "firebase/firestore";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultEntry(entryType: string | null): Entry | null {
  if (isNullOrWhiteSpace(entryType) || typeof entryType !== "string") {
    return null;
  }
  const parsedEntryType = parseEnumValue(entryType, EntryType);
  if (parsedEntryType === null) {
    return null;
  }
  const now = new Date();
  const timestamp = Timestamp.fromDate(now);
  let result: Entry = {
    id: "",
    entryType: parsedEntryType,
    activityContexts: [],
    startTimestamp: timestamp,
    endTimestamp: timestamp,
    imageURLs: [],
    note: "",
    leftStopwatchIsRunning: undefined,
    leftTime: undefined,
    leftVolume: undefined,
    rightStopwatchIsRunning: undefined,
    rightTime: undefined,
    rightVolume: undefined,
    nasalHygieneIds: [],
    poopAmount: undefined,
    poopColorId: undefined,
    poopTextureId: undefined,
    size: undefined,
    temperature: undefined,
    temperatureMethodId: undefined,
    urineAmount: undefined,
    weight: undefined,
  };
  return result;
}
