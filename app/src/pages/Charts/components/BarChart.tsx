import * as d3 from "d3";

import { Box, Paper, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { YAxisUnit } from "@/types/YAxisUnit";
import { chartHeight } from "@/utils/constants";
import formatStopwatchTime from "@/utils/formatStopwatchTime";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getDateKeyFromTimestamp } from "@/utils/getDateKeyFromTimestamp";
import { getDaysCountForTimePeriod } from "@/pages/Charts/utils/getDaysCountForTimePeriod";
import { getHoursCountForTimePeriod } from "@/pages/Charts/utils/getHoursCountForTimePeriod";
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";
import { getYAxisUnit } from "@/pages/Charts/utils/getYAxisUnit";
import { isSameDay } from "@/utils/isSameDay";
import { v4 as uuid } from "uuid";

type Datapoint = {
  id: string;
  date: Date;
  /**
   * The value of the datapoint.
   * Might be a count, duration, or volume depending on the Y-axis type.
   * If it's a duration, the value is in minutes.
   * If it's a volume, the value is in milliliters.
   */
  value: number;
};

type Props = {
  entries: Entry[];
  entryTypeId: EntryTypeId;
  timePeriod: TimePeriodId;
  yAxisType: YAxisType;
  xAxisUnit: XAxisUnit;
  backgroundColor: string;
};

export function BarChart(props: Props) {
  const theme = useTheme();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgOverlayRef = useRef<SVGSVGElement | null>(null);
  const chartRef = useRef<boolean>(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const id = useMemo(() => uuid(), []);
  const chartId = `bar-chart-${id}`;
  const chartOverlayId = `${chartId}-overlay`;
  const chartSVGId = `${chartId}-svg`;
  const chartSVGOverlayId = `${chartId}-svg-overlay`;
  const outerContainerId = `${chartId}-outer-container`;
  const innerContainerId = `${chartId}-inner-container`;

  const barsCount =
    props.xAxisUnit === "hours"
      ? getHoursCountForTimePeriod(props.timePeriod)
      : getDaysCountForTimePeriod(props.timePeriod);

  const startTimestamp = getStartTimestampForTimePeriod(props.timePeriod);
  const startDate = getDateFromTimestamp(startTimestamp);
  startDate.setHours(0, 0, 0, 0);

  const dates: Date[] = [];

  const now = new Date();
  now.setMinutes(0, 0, 0);

  if (props.xAxisUnit === "days") {
    dates.push(now);
    for (let i = barsCount - 1; i >= 1; i--) {
      const newDate = new Date();
      newDate.setDate(now.getDate() - i);
      newDate.setHours(0, 0, 0, 0);
      dates.unshift(newDate);
    }
  } else {
    for (let i = barsCount - 1; i >= 1; i--) {
      const newDate = new Date();
      newDate.setHours(now.getHours() - i, 0, 0, 0);
      dates.unshift(newDate);
    }
  }

  const filterEntries = useCallback(
    (entries: Entry[], date: Date, unit: XAxisUnit): Entry[] => {
      return entries.filter((entry) => {
        const entryStartDate = getDateFromTimestamp(entry.startTimestamp);

        if (!isSameDay({ targetDate: entryStartDate, comparisonDate: date })) {
          return false;
        }

        if (entry.entryTypeId != props.entryTypeId) {
          return false;
        }

        if (unit === "hours") {
          return entryStartDate.getHours() === date.getHours();
        }

        return true;
      });
    },
    [props.entryTypeId] // Add dependencies here if needed
  );

  const calculateValue = (entries: Entry[], yAxisType: string): number => {
    if (yAxisType === "count") {
      return entries.length;
    } else if (yAxisType === "duration") {
      const result = entries.reduce(
        (acc, entry) => acc + (entry.leftTime ?? 0) + (entry.rightTime ?? 0),
        0
      );
      if (result > 0) {
        return result / 1000 / 60;
      }
      return result;
    } else if (yAxisType === "volume") {
      return entries.reduce(
        (acc, entry) =>
          acc + (entry.leftVolume ?? 0) + (entry.rightVolume ?? 0),
        0
      );
    }
    return 0;
  };

  const datapoints: Datapoint[] = useMemo(() => {
    return dates
      .map((date) => {
        const entries = filterEntries(props.entries, date, props.xAxisUnit);

        const result = {
          id: uuid(),
          date,
          value: calculateValue(entries, props.yAxisType),
        };

        return result;
      })
      .sort((a, b) => d3.ascending(a.date, b.date));
  }, [dates, props.entries, props.xAxisUnit, props.yAxisType]);

  if (props.xAxisUnit === "hours") {
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

  const barWidth = 48;
  const spacing = 8;
  const mainFontSize = barWidth / 3.25;
  const secondaryFontSize = barWidth / 3.75;
  const chartMarginTop = spacing * 2 + mainFontSize;
  const chartMarginRight = spacing;
  const chartMarginLeft =
    props.yAxisType === "duration" ? spacing * 8 : spacing * 4;
  const chartMarginBottom = spacing * (props.xAxisUnit === "hours" ? 12 : 8);
  const chartContainerHeight = chartHeight + chartMarginTop + chartMarginBottom;
  // const xScalePaddingLeft = props.xAxisUnit === "hours" ? barWidth / 4 : 0;
  const chartWidth =
    barWidth * (barsCount + 1) + chartMarginLeft + chartMarginRight;
  // + xScalePaddingLeft;
  const barPadding = 0.25;

  useEffect(() => {
    if (!svgRef.current || chartRef.current) return;

    // Clear the existing SVG content before re-rendering
    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(svgOverlayRef.current).selectAll("*").remove();
    chartRef.current = false;

    const getMax = () => {
      const maxValue = d3.max(datapoints, (d) => d.value) as number;
      if (props.yAxisType === "duration") {
        if (props.xAxisUnit === "hours") {
          if (maxValue >= 60) {
            return Math.max(maxValue, 60);
          } else if (maxValue >= 45) {
            return 60;
          } else if (maxValue >= 30) {
            return 45;
          } else if (maxValue >= 15) {
            return 30;
          } else if (maxValue >= 5) {
            return 15;
          } else {
            return 5;
          }
        }
      }
      return maxValue;
    };

    // const min = d3.min(datapoints, (d) => d.value) as number;
    const min = 0;
    const max = getMax();

    const yAxisUnit = getYAxisUnit({
      yAxisType: props.yAxisType,
      min,
      max,
    });

    const getYAxisTicksCount = () => {
      if (max <= 5) {
        return max;
      }
      if (props.yAxisType === "duration") {
        if (props.xAxisUnit === "hours") {
          if (max > 60) {
            return undefined;
          } else if (max > 45) {
            return 12;
          } else if (max > 30) {
            return 9;
          } else if (max > 15) {
            return 6;
          } else if (max > 5) {
            return 3;
          } else {
            return undefined;
          }
        }
        return undefined;
      }
      return undefined;
    };

    const getValueById = (id: string) => {
      const dataPoint = datapoints.find((d) => d.id === id);
      return dataPoint ? dataPoint.value : 0;
    };

    const getDateById = (id: string) => {
      const dataPoint = datapoints.find((d) => d.id === id);
      return dataPoint ? dataPoint.date : new Date();
    };

    const valueFormatter = (value: number, axis: "x" | "y") => {
      if (props.yAxisType === "duration") {
        const milliseconds = value * 60 * 1000;
        const hours = Math.floor(milliseconds / 3600000);
        if (yAxisUnit === "hours") {
          return `${hours} h`;
        }
        if (axis === "x") {
          return formatStopwatchTime(milliseconds, true, false, true, true);
        }
        return formatStopwatchTime(milliseconds, false, false, true, true);
      }

      return value.toFixed();
    };

    // Setting up the scales

    const xScale = d3
      .scaleBand()
      .domain(
        d3.groupSort(
          datapoints,
          ([d]) => d.date,
          (d) => d.id
        )
      )
      .rangeRound([
        chartMarginLeft,
        // chartMarginLeft + xScalePaddingLeft,
        chartMarginLeft + barWidth * (barsCount + 1 + barPadding),
        // - xScalePaddingLeft,
      ])
      .padding(barPadding);

    const yScale = d3
      .scaleLinear()
      .domain([min, max])
      .nice()
      .range([chartHeight - chartMarginBottom, chartMarginTop]);

    // Setting up the SVGs

    const svg = d3.select(svgRef.current);
    const svgOverlay = d3.select(svgOverlayRef.current);

    // Adding rectangles for each bar

    svg
      .append("g")
      .attr("fill", () => theme.palette.primary.main)
      .selectAll()
      .data(datapoints)
      .join("rect")
      .attr(
        "x",
        (datapoint) => xScale(datapoint.id) as number
        // (datapoint) => (xScale(datapoint.id) as number) + xScalePaddingLeft
      )
      .attr("y", (datapoint) => yScale(0)) // Set to 0 to animate bars from bottom to top
      .attr("height", 0) // Set to 0 to animate bars from bottom to top
      .attr("width", xScale.bandwidth())
      .attr("class", "bar")
      .attr("id", (datapoint) => `bar-${datapoint.id}`);

    // Adding the bottom x-axis with date labels

    const bottomXAxis = d3
      .axisBottom(xScale)
      .tickFormat((id) => {
        const date = getDateById(id as string);

        if (date == null) return "";

        if (props.xAxisUnit === "hours") {
          if (
            props.timePeriod == TimePeriodId.Last2Days ||
            props.timePeriod == TimePeriodId.Last24Hours
          ) {
            return date.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              weekday: "short",
            });
          }

          return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        return date.toLocaleDateString("fr-FR", {
          month: "short",
          day: "numeric",
        });
      })
      .tickSizeOuter(0);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        // `translate(${xScalePaddingLeft}, ${chartHeight - chartMarginBottom})`
        `translate(0, ${chartHeight - chartMarginBottom})`
      )
      .call(bottomXAxis)
      .call((g) =>
        g.select(".domain").attr(
          "transform",
          // `translate(${(xScalePaddingLeft / (barPadding * 2)) * -1},0)`
          `translate(0,0)`
        )
      )
      .selectAll("text")
      .attr("font-size", mainFontSize)
      // .attr("transform", "translate(-10,5)rotate(-45)")
      .attr("transform", () => {
        if (props.xAxisUnit === "hours") {
          return "translate(-15,5)rotate(-65)";
        }
        return "translate(-10,5)rotate(-45)";
      })
      .style("text-anchor", "end")
      .style("color", theme.palette.text.secondary)
      .style("alignment-baseline", "middle")
      .attr("class", "x-axis-label");

    // Adding the top x-axis with value labels

    const topXAxis = d3
      .axisTop(xScale)
      .tickFormat((id) => {
        const value = getValueById(id as string);
        if (value === 0) {
          return "";
        }
        return valueFormatter(value, "x");
      })
      .tickSizeOuter(0);

    svg
      .append("g")
      // .attr("transform", `translate(${xScalePaddingLeft}, ${chartMarginTop})`)
      .attr("transform", `translate(0, ${chartMarginTop})`)
      .call(topXAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .selectAll("text")
      .attr("transform", (id) => {
        if (id == null) return "";
        const y =
          yScale(getValueById(id as string)) - (spacing * 2 + mainFontSize);
        return `translate(0, ${y})`;
      })
      .style("font-size", secondaryFontSize)
      // .style("font-weight", "bold")
      .style("text-anchor", "middle")
      .attr("class", "bar-value-label")
      .style("color", theme.palette.text.primary)
      .style("opacity", 0); // Hide the labels until the bars are animated

    // Adding the y-axis

    svg
      .append("g")
      .style("opacity", 0) // A fixed y-axis is added in the overlay SVG, so this one is hidden
      .attr("transform", `translate(${chartMarginLeft},0)`)
      .attr("class", "y-axis")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((y) => {
            return valueFormatter(y as number, "y");
          })
          .ticks(getYAxisTicksCount())
      )
      .call((g: any) => g.select(".domain").remove());

    // Adding the overlay y-axis

    svgOverlay
      .style("position", "absolute")
      .style("top", "0")
      .style("left", "0")
      .style("pointer-events", "none")
      .style("z-index", "1")
      .append("g")
      .attr("class", "y-axis-overlay")
      .attr("transform", `translate(0,${chartHeight - chartMarginBottom})`)
      .attr("transform", `translate(${chartMarginLeft},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((y) => {
            return valueFormatter(y as number, "y");
          })
          .ticks(getYAxisTicksCount())
      )
      .call((g: any) =>
        g
          .selectAll(".tick")
          .attr("class", "y-axis-tick")
          .attr("font-size", mainFontSize)
          .style("color", theme.palette.text.secondary)
      )
      .call((g: any) =>
        g
          .selectAll(".tick text")
          .attr("font-weight", "bold")
          .attr("class", "y-axis-label")
          .attr("font-size", mainFontSize)
      );

    // Animate the bars and show the value labels

    const showBarValueLabels = () => {
      svg
        .selectAll(".bar-value-label")
        .transition()
        .duration(500)
        .style("opacity", 1);
    };

    requestAnimationFrame(() => {
      if (!svgRef.current) return;

      svg
        .selectAll(".bar")
        .transition()
        .duration(500)
        .attr("y", (datapoint) => yScale((datapoint as Datapoint).value))
        .attr(
          "height",
          (datapoint) => yScale(0) - yScale((datapoint as Datapoint).value)
        )
        .delay((datapoint, index) => index * 10)
        .on("end", (datapoint, index) => {
          if (index !== 0) return;
          showBarValueLabels();
        });
    });

    // Setting the dimensions of the chart overlay

    const overlay = overlayRef.current;

    if (overlay) {
      overlay.style.width = `${chartMarginLeft}px`;
      overlay.style.height = `${chartHeight}px`;
    }
  }, [
    datapoints,
    props.yAxisType,
    theme.palette.primary.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
    props.xAxisUnit,
    props.timePeriod,
  ]);

  const renderSVG = (id: string, ref: React.RefObject<SVGSVGElement>) => (
    <svg
      id={id}
      ref={ref}
      width={chartWidth}
      height={chartHeight}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      style={{
        outline: "none",
      }}
    ></svg>
  );

  return (
    <Box
      id={outerContainerId}
      sx={{
        maxHeight: chartContainerHeight,
        position: "relative",
        userSelect: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        id={innerContainerId}
        sx={{
          position: "relative",
          width: "100%",
          overflowX: "scroll",
        }}
      >
        {renderSVG(chartSVGId, svgRef)}
      </Box>
      <Paper
        id={chartOverlayId}
        ref={overlayRef}
        sx={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
          height: chartHeight,
          width: chartMarginLeft,
          borderRadius: 0,
          boxShadow: "none",
          backgroundColor: props.backgroundColor,
        }}
      />
      {renderSVG(chartSVGOverlayId, svgOverlayRef)}
    </Box>
  );
}
