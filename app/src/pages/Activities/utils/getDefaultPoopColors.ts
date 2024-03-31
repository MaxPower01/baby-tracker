import { PoopColorId } from "@/enums/PoopColorId";
import { PoopTextureId } from "@/enums/PoopTextureId";
import { getPoopColor } from "@/utils/getPoopColor";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultPoopColors() {
  let result = [];
  for (const value in PoopColorId) {
    if (!isNaN(Number(value))) {
      const { name: label, value: colorValue } = getPoopColor(
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
