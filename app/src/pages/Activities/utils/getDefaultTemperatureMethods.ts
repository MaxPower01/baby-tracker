import { TemperatureMethodId } from "@/enums/TemperatureMethodId";
import { getTemperatureMethodName } from "@/utils/getTemperatureMethodName";
import { parseEnumValue } from "@/utils/parseEnumValue";

export function getDefaultTemperatureMethods() {
  let result = [];
  for (const value in TemperatureMethodId) {
    if (!isNaN(Number(value))) {
      result.push({
        id: Number(value),
        label: getTemperatureMethodName(
          parseEnumValue(value, TemperatureMethodId)
        ),
      });
    }
  }
  return result;
}
