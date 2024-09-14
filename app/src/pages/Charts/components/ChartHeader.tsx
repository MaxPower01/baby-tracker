import * as d3 from "d3";

import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";
import { ChartLegend } from "@/pages/Charts/components/ChartLegend";
import { ChartLegendItemProps } from "@/pages/Charts/components/ChartLegendItem";
import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";
import { StackedBarChartDatapoint } from "@/pages/Charts/types/StackedBarChartDatapoint";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { YAxisUnit } from "@/types/YAxisUnit";
import { getChartLegendItem } from "@/pages/Charts/utils/getChartLegendItem";
import { useTheme } from "@mui/material";

type Props = {
  entryType: EntryTypeId;
  yAxisUnit: YAxisUnit;
  xAxisUnit: XAxisUnit;
  yAxisType: YAxisType;
  datapoints: Array<BarChartDatapoint | StackedBarChartDatapoint>;
};

export default function ChartHeader(props: Props) {
  const theme = useTheme();

  const isStacked = props.datapoints.some(
    (d) => (d as StackedBarChartDatapoint).dateISOString !== undefined
  );

  const legendItems: Array<ChartLegendItemProps> = [];

  if (isStacked) {
    const datapointsByCategory = d3.group(
      props.datapoints as StackedBarChartDatapoint[],
      (d) => d.category
    );
    for (const [category, datapoints] of datapointsByCategory) {
      legendItems.push(
        getChartLegendItem({
          entryType: props.entryType,
          yAxisunit: props.yAxisUnit,
          xAxisUnit: props.xAxisUnit,
          yAxisType: props.yAxisType,
          category: category,
          value: d3.sum(datapoints, (d) => d.value),
          theme: theme,
        })
      );
    }
  } else {
    legendItems.push(
      getChartLegendItem({
        entryType: props.entryType,
        yAxisunit: props.yAxisUnit,
        xAxisUnit: props.xAxisUnit,
        yAxisType: props.yAxisType,
        value: d3.sum(props.datapoints, (d) => d.value),
        theme: theme,
      })
    );
  }

  return <ChartLegend items={legendItems} />;
}
