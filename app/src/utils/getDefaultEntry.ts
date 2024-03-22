import { Entry } from "@/pages/Entry/types/Entry";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import { Timestamp } from "firebase/firestore";
import { getTimestamp } from "@/utils/getTimestamp";
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
  const timestamp = getTimestamp(new Date());
  let result: Entry = {
    id: "",
    entryType: parsedEntryType,
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
    nasalHygieneIds: [],
    poopAmount: null,
    poopColorId: null,
    poopTextureId: null,
    size: null,
    temperature: null,
    temperatureMethodId: null,
    urineAmount: null,
    weight: null,
    createdBy: "",
    editedBy: "",
    createdTimestamp: null,
    editedTimestamp: null,
  };
  return result;
}
