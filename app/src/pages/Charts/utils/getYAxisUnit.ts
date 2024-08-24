import { YAxisType } from "@/types/YAxisType";
import { YAxisUnit } from "@/types/YAxisUnit";

export function getYAxisUnit(props: {
  yAxisType: YAxisType;
  min: number;
  max: number;
}): YAxisUnit {
  let result: YAxisUnit = "count";

  if (props.yAxisType === "volume") {
    if (props.max - props.min <= 100) {
      result = "milliliters";
    } else {
      result = "ounces";
    }

    return result;
  }

  if (props.yAxisType === "duration") {
    const milliseconds = props.max as number;

    if (milliseconds === 0) {
      result = "seconds";
    }

    const hours = Math.floor(milliseconds / 3600000);
    const remainingMillisecondsAfterHours = milliseconds % 3600000;
    const minutes = Math.floor(remainingMillisecondsAfterHours / 60000);

    if (hours >= 4) {
      result = "hours";
    } else if (minutes >= 5) {
      result = "minutes";
    } else {
      result = "seconds";
    }

    return result;
  }

  return result;
}
