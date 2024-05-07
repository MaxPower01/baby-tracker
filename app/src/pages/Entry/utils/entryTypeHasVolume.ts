import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

const entryTypesWithVolume = [
  EntryTypeId.Medicine,
  EntryTypeId.BottleFeeding,
  EntryTypeId.MilkExtraction,
];

export function entryTypeHasVolume(entryType: EntryTypeId) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithVolume.includes(parsed);
      } else {
        return entryTypesWithVolume.includes(
          EntryTypeId[entryType as keyof typeof EntryTypeId]
        );
      }
    }
    return entryTypesWithVolume.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
