import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisUnit } from "@/types/YAxisUnit";

export function getChartCardSubtitle(
  xAxisUnit: XAxisUnit,
  yAxisUnit: YAxisUnit
) {
  let result;

  switch (yAxisUnit) {
    case "count":
      result = "Nombre par";
      break;
    case "duration":
      result = "Durée par";
      break;
    case "volume":
      result = "Volume par";
      break;
    default:
      break;
  }

  if (xAxisUnit === "days") {
    result += " jour";
  } else {
    result += " heure";
  }
  return result;
}
