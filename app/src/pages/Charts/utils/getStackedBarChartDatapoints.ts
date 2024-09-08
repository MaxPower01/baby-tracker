import * as d3 from "d3";

import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { StackedBarChartDatapoint } from "@/pages/Charts/types/StackedBarChartDatapoint";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { filterEntries } from "@/pages/Charts/utils/filterEntries";
import { getDates } from "@/pages/Charts/utils/getDates";
import { getEntriesValue } from "@/pages/Charts/utils/getEntriesValue";
import { v4 as uuid } from "uuid";

export function getStackedBarChartDatapoints(
  entries: Entry[],
  xAxisUnit: XAxisUnit,
  entryTypeId: EntryTypeId,
  yAxisType: YAxisType,
  barsCount: number,
  timePeriod: TimePeriodId,
  dates?: Date[]
): StackedBarChartDatapoint[] {
  if (!dates) {
    dates = getDates(timePeriod, barsCount, xAxisUnit);
  }

  const datapoints = dates
    .map((date) => {
      const filteredEntries = filterEntries(
        entries,
        date,
        xAxisUnit,
        entryTypeId
      ).filter(
        (entry, index, self) =>
          self.findIndex((t) => t.id === entry.id) === index
      );

      const leftValue = getEntriesValue(filteredEntries, yAxisType, "left");
      const rightValue = getEntriesValue(filteredEntries, yAxisType, "right");

      const results: StackedBarChartDatapoint[] = [
        {
          id: uuid(),
          date,
          dateISOString: date.toISOString(),
          value: leftValue,
          category: DatapointCategory.Left,
        },
        {
          id: uuid(),
          date,
          dateISOString: date.toISOString(),
          value: rightValue,
          category: DatapointCategory.Right,
        },
      ];

      return results;
    })
    .sort((a, b) => d3.descending(a[0].date, b[0].date))
    .flat();

  if (yAxisType === "duration" && xAxisUnit === "hours") {
    for (let i = 0; i < datapoints.length; i++) {
      const datapoint = datapoints[i];

      const isLastOrBeforeLast =
        i === datapoints.length - 1 || i === datapoints.length - 2;

      if (isLastOrBeforeLast) continue;

      const nextDatapoint = datapoints
        .slice(i + 1)
        .find((d) => d.category === datapoint.category);

      if (nextDatapoint == null) continue;

      if (datapoint.value > 60) {
        const excess = datapoint.value - 60;
        datapoint.value = 60;
        nextDatapoint.value += excess;
      }
    }
  }

  return datapoints;
}
