import { PoopTextureId } from "@/enums/PoopTextureId";
import { getPoopConsistencyTypeName } from "@/utils/getPoopConsistencyTypeName";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultPoopConsistencyTypes() {
  let result = [];
  for (const value in PoopTextureId) {
    if (!isNaN(Number(value))) {
      result.push({
        id: Number(value),
        label: getPoopConsistencyTypeName(parseEnumValue(value, PoopTextureId)),
      });
    }
  }
  return result;
}
