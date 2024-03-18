import { NasalHygieneId } from "@/enums/NasalHygieneId";
import { TemperatureMethodId } from "@/enums/TemperatureMethodId";
import { getNasalHygieneTypeName } from "@/utils/getNasalHygieneTypeName";
import { getTemperatureMethodName } from "@/utils/getTemperatureMethodName";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultNasalHygieneTypes() {
  let result = [];
  for (const value in NasalHygieneId) {
    if (!isNaN(Number(value))) {
      result.push({
        id: Number(value),
        label: getNasalHygieneTypeName(parseEnumValue(value, NasalHygieneId)),
      });
    }
  }
  return result;
}
