import { NasalHygieneType } from "@/enums/NasalHygieneType";
import { TemperatureMethod } from "@/enums/TemperatureMethod";
import { getNasalHygieneTypeName } from "@/utils/getNasalHygieneTypeName";
import { getTemperatureMethodName } from "@/utils/getTemperatureMethodName";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultNasalHygieneTypes() {
  let result = [];
  for (const value in NasalHygieneType) {
    if (!isNaN(Number(value))) {
      result.push({
        id: Number(value),
        label: getNasalHygieneTypeName(parseEnumValue(value, NasalHygieneType)),
      });
    }
  }
  return result;
}
