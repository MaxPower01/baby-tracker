import { PoopColorId } from "@/enums/PoopColorId";
import { PoopTextureId } from "@/enums/PoopTextureId";
import { getPoopColor } from "@/utils/getPoopColor";
import { parseEnumValue } from "@/utils/parseEnumValue";

const order = [
  PoopColorId.LightBrown,
  PoopColorId.Brown,
  PoopColorId.DarkBrown,
  PoopColorId.Red,
  PoopColorId.Orange,
  PoopColorId.Yellow,
  PoopColorId.Green,
  PoopColorId.White,
];

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
  result.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return result;
}
