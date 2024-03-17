import { TemperatureMethod } from "@/enums/TemperatureMethod";
import { getTemperatureMethodName } from "@/utils/getTemperatureMethodName";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultTemperatureMethods() {
  let result = [];
  for (const value in TemperatureMethod) {
    if (!isNaN(Number(value))) {
      result.push({
        id: Number(value),
        label: getTemperatureMethodName(
          parseEnumValue(value, TemperatureMethod)
        ),
      });
    }
  }
  return result;
}
