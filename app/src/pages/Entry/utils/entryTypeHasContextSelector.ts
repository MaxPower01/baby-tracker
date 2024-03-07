import { EntryType } from "@/pages/Entries/enums/EntryType";

const entryTypesWithContextSelector = [
  EntryType.Medicine,
  EntryType.VitaminsAndSupplements,
  EntryType.BabyCare,
  EntryType.Vaccine,
  EntryType.Activity,
  EntryType.Sleep,
  EntryType.BabyMash,
  EntryType.BottleFeeding,
];

export function entryTypeHasContextSelector(entryType: EntryType) {
  try {
    if (typeof entryType === "string") {
      const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithContextSelector.includes(parsed);
      } else {
        return entryTypesWithContextSelector.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }
    }
    return entryTypesWithContextSelector.includes(entryType);
  } catch (error) {
    console.error(error);
    return false;
  }
}
