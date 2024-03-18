import { PoopConsistencyId } from "@/enums/PoopConsistencyId";
import { getPoopConsistencyTypeName } from "@/utils/getPoopConsistencyTypeName";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultPoopConsistencyTypes() {
  let result = [];
  for (const value in PoopConsistencyId) {
    if (!isNaN(Number(value))) {
      result.push({
        id: Number(value),
        label: getPoopConsistencyTypeName(
          parseEnumValue(value, PoopConsistencyId)
        ),
      });
    }
  }
  return result;
}
