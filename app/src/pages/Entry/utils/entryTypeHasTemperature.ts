import { EntryType } from "@/pages/Entries/enums/EntryType";

const entryTypesWithTemperature = [EntryType.Temperature];

export function entryTypeHasTemperature(entryType: EntryType) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithTemperature.includes(parsed);
      } else {
        return entryTypesWithTemperature.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }
    }
    return entryTypesWithTemperature.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
