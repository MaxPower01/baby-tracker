import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";

export function getChartLayout(
  yAxisType: YAxisType,
  xAxisUnit: XAxisUnit,
  barsCount: number
) {
  const chartHeight = 400;
  const barWidth = 48;
  const spacing = 8;
  const mainFontSize = barWidth / 3.25;
  const secondaryFontSize = barWidth / 3.75;
  const chartMarginTop = spacing * 2 + mainFontSize;
  const chartMarginRight = spacing;
  const chartMarginLeft = yAxisType === "count" ? spacing * 4 : spacing * 8;
  const chartMarginBottom = spacing * (xAxisUnit === "hours" ? 12 : 8);
  const chartContainerHeight = chartHeight + chartMarginTop + chartMarginBottom;
  const chartWidth =
    barWidth * (barsCount + 1) + chartMarginLeft + chartMarginRight;
  const barPadding = 0.25;

  return {
    barWidth,
    spacing,
    mainFontSize,
    secondaryFontSize,
    chartMarginTop,
    chartMarginRight,
    chartMarginLeft,
    chartMarginBottom,
    chartContainerHeight,
    chartWidth,
    barPadding,
    chartHeight,
  };
}
