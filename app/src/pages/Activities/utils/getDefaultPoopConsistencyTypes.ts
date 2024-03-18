import { PoopConsistency } from "@/enums/PoopConsistency";
import { getPoopConsistencyTypeName } from "@/utils/getPoopConsistencyTypeName";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultPoopConsistencyTypes() {
  let result = [];
  for (const value in PoopConsistency) {
    if (!isNaN(Number(value))) {
      result.push({
        id: Number(value),
        label: getPoopConsistencyTypeName(
          parseEnumValue(value, PoopConsistency)
        ),
      });
    }
  }
  return result;
}
