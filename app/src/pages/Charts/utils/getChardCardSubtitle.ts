import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";

export function getChartCardSubtitle(
  xAxisUnit: XAxisUnit,
  yAxisType: YAxisType
) {
  let result;

  switch (yAxisType) {
    case "count":
      result = "Fréquence par";
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
