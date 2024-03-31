import { PoopTextureId } from "@/enums/PoopTextureId";
import { getPoopTextureName } from "@/utils/getPoopTextureName";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultPoopTextureIds() {
  let result = [];
  for (const value in PoopTextureId) {
    if (!isNaN(Number(value))) {
      result.push({
        id: Number(value),
        label: getPoopTextureName(parseEnumValue(value, PoopTextureId)),
      });
    }
  }
  return result;
}
