import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { parseEnumValue } from "@/utils/parseEnumValue";

const entryTypesWithContextSelector = [
  EntryTypeId.Medicine,
  EntryTypeId.VitaminsAndSupplements,
  EntryTypeId.BabyCare,
  EntryTypeId.Vaccine,
  EntryTypeId.Activity,
  EntryTypeId.Sleep,
  EntryTypeId.BabyMash,
  EntryTypeId.BottleFeeding,
  EntryTypeId.SolidFood,
  EntryTypeId.Symptom,
  EntryTypeId.Hospital,
  EntryTypeId.NasalHygiene,
  EntryTypeId.Temperature,
];

export function entryTypeHasContextSelector(entryType: EntryTypeId) {
  try {
    const parsedEntryType = parseEnumValue(entryType, EntryTypeId);
    if (parsedEntryType === null) return false;
    return entryTypesWithContextSelector.includes(parsedEntryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
