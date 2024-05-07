import { TemperatureMethodId } from "@/enums/TemperatureMethodId";

export function getTemperatureMethodName(
  temperatureMethod: TemperatureMethodId | null | undefined
) {
  if (temperatureMethod === null || temperatureMethod === undefined) {
    return "";
  }
  switch (temperatureMethod) {
    case TemperatureMethodId.Oral:
      return "Dans la bouche";
    case TemperatureMethodId.Rectal:
      return "Par voie rectale";
    case TemperatureMethodId.Axillary:
      return "Sous le bras";
    case TemperatureMethodId.Tympanic:
      return "Dans l'oreille";
    case TemperatureMethodId.Frontal:
      return "Par infrarouge sur le front";
    default:
      return "";
  }
}
