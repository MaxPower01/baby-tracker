import { EntryType } from "@/pages/Entries/enums/EntryType";

const entryTypesWithVolume = [EntryType.Medicine, EntryType.BottleFeeding];

export function entryTypeHasVolume(entryType: EntryType) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithVolume.includes(parsed);
      } else {
        return entryTypesWithVolume.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }
    }
    return entryTypesWithVolume.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
