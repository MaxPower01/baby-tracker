import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";

const entryTypesWithTemperature = [EntryTypeId.Temperature];

export function entryTypeHasTemperature(entryType: EntryTypeId) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithTemperature.includes(parsed);
      } else {
        return entryTypesWithTemperature.includes(
          EntryTypeId[entryType as keyof typeof EntryTypeId]
        );
      }
    }
    return entryTypesWithTemperature.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
