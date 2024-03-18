import { PoopConsistencyId } from "@/enums/PoopConsistencyId";
import { getPoopColorValue } from "@/utils/getPoopColorValue";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultPoopColors() {
  let result = [];
  for (const value in PoopConsistencyId) {
    if (!isNaN(Number(value))) {
      const { label, value: colorValue } = getPoopColorValue(
        parseEnumValue(value, PoopConsistencyId)
      );
      result.push({
        id: Number(value),
        label,
        value: colorValue,
      });
    }
  }
  return result;
}
