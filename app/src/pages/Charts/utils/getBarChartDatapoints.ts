import * as d3 from "d3";

import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { filterEntries } from "@/pages/Charts/utils/filterEntries";
import { getDates } from "@/pages/Charts/utils/getDates";
import { getEntriesValue } from "@/pages/Charts/utils/getEntriesValue";
import { v4 as uuid } from "uuid";

export function getBarChartDatapoints(
  entries: Entry[],
  xAxisUnit: XAxisUnit,
  entryTypeId: EntryTypeId,
  yAxisType: YAxisType,
  barsCount: number,
  timePeriod: TimePeriodId
): BarChartDatapoint[] {
  const dates = getDates(timePeriod, barsCount, xAxisUnit);

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

      const result = {
        id: uuid(),
        date,
        value: getEntriesValue(filteredEntries, yAxisType),
      };

      return result;
    })
    .sort((a, b) => d3.descending(a.date, b.date));

  if (yAxisType === "duration" && xAxisUnit === "hours") {
    for (let i = 0; i < datapoints.length; i++) {
      const datapoint = datapoints[i];
      const nextDatapoint = datapoints[i + 1];
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
