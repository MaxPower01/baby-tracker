/*       const parsed = parseInt(entryType);
      if (!isNaN(parsed)) {
        return entryTypesWithContextSelector.includes(parsed);
      } else {
        return entryTypesWithContextSelector.includes(
          EntryType[entryType as keyof typeof EntryType]
        );
      }*/

import { EntryType } from "@/pages/Entries/enums/EntryType";

export function parseEnumValue<T>(
  value: number | string,
  enumType: { [P in keyof T]?: T[P] }
): number | null {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    let parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else {
      const enumValue = enumType[value as keyof typeof enumType];
      if (typeof enumValue === "number") {
        return enumValue;
      }
    }
  }
  return null;
}
