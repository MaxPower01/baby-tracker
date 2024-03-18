import { PoopColorId } from "@/enums/PoopColorId";
import { PoopConsistencyId } from "@/enums/PoopConsistencyId";
import { getPoopColorValue } from "@/utils/getPoopColorValue";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultPoopColors() {
  let result = [];
  for (const value in PoopColorId) {
    if (!isNaN(Number(value))) {
      const { label, value: colorValue } = getPoopColorValue(
        parseEnumValue(value, PoopColorId)
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
