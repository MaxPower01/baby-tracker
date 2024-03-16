import { TemperatureMethod } from "@/enums/TemperatureMethod";

export function getTemperatureMethodName(
  temperatureMethod: TemperatureMethod | null | undefined
) {
  if (temperatureMethod === null || temperatureMethod === undefined) {
    return "";
  }
  switch (temperatureMethod) {
    case TemperatureMethod.Oral:
      return "Dans la bouche";
    case TemperatureMethod.Rectal:
      return "Par voie rectale";
    case TemperatureMethod.Axillary:
      return "Sous le bras";
    case TemperatureMethod.Tympanic:
      return "Dans l'oreille";
    case TemperatureMethod.Frontal:
      return "Par infrarouge sur le front";
    default:
      return "";
  }
}
