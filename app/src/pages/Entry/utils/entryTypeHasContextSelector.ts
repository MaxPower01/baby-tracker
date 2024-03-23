import { EntryType } from "@/pages/Entries/enums/EntryType";
import { parseEnumValue } from "@/utils/parseEnumValue";

const entryTypesWithContextSelector = [
  EntryType.Medicine,
  EntryType.VitaminsAndSupplements,
  EntryType.BabyCare,
  EntryType.Vaccine,
  EntryType.Activity,
  EntryType.Sleep,
  EntryType.BabyMash,
  EntryType.BottleFeeding,
  EntryType.SolidFood,
  EntryType.Symptom,
  EntryType.Hospital,
  EntryType.NasalHygiene,
  EntryType.Temperature,
];

export function entryTypeHasContextSelector(entryType: EntryType) {
  try {
    const parsedEntryType = parseEnumValue(entryType, EntryType);
    if (parsedEntryType === null) return false;
    return entryTypesWithContextSelector.includes(parsedEntryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
