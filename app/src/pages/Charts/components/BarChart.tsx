import * as d3 from "d3";

import { Box, Paper, Stack, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";

import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";
import ChartHeader from "@/pages/Charts/components/ChartHeader";
import { ChartLegend } from "@/pages/Charts/components/ChartLegend";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { getBarChartDatapoints } from "@/pages/Charts/utils/getBarChartDatapoints";
import { getBarsCount } from "@/pages/Charts/utils/getBarsCount";
import { getChartBarColor } from "@/pages/Charts/utils/getChartBarColor";
import { getChartLayout } from "@/pages/Charts/utils/getChartLayout";
import { getChartLegendItem } from "@/pages/Charts/utils/getChartLegendItem";
import { getDatapointDate } from "@/pages/Charts/utils/getDatapointDate";
import { getDatapointsValue } from "@/pages/Charts/utils/getDatapointsValue";
import { getMinMax } from "@/pages/Charts/utils/getMinMax";
import { getYAxisTicksCount } from "@/pages/Charts/utils/getYAxisTicksCount";
import { getYAxisUnit } from "@/pages/Charts/utils/getYAxisUnit";
import { v4 as uuid } from "uuid";
import { valueFormatter } from "@/pages/Charts/utils/valueFormatter";

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

  const barsCount = getBarsCount(props.timePeriod, props.xAxisUnit);

  const datapoints = useMemo(
    () =>
      getBarChartDatapoints(
        props.entries,
        props.xAxisUnit,
        props.entryTypeId,
        props.yAxisType,
        barsCount,
        props.timePeriod
      ),
    [
      props.entries,
      props.xAxisUnit,
      props.entryTypeId,
      props.yAxisType,
      barsCount,
      props.timePeriod,
    ]
  );

  const chartLayout = useMemo(
    () => getChartLayout(props.yAxisType, props.xAxisUnit, barsCount),
    [props.yAxisType, props.xAxisUnit, barsCount]
  );

  const { min, max } = useMemo(
    () => getMinMax(datapoints, props.yAxisType, props.xAxisUnit),
    [datapoints, props.yAxisType, props.xAxisUnit]
  );

  const yAxisUnit = useMemo(
    () =>
      getYAxisUnit({
        yAxisType: props.yAxisType,
        min,
        max,
      }),
    [props.yAxisType, min, max]
  );

  useEffect(() => {
    if (!svgRef.current || chartRef.current) return;

    // Clear the existing SVG content before re-rendering

    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(svgOverlayRef.current).selectAll("*").remove();

    chartRef.current = false;

    // Get the chart layout values

    const {
      barPadding,
      barWidth,
      chartMarginBottom,
      chartMarginLeft,
      chartWidth,
      chartContainerHeight,
      mainFontSize,
      secondaryFontSize,
      spacing,
      chartMarginRight,
      chartMarginTop,
      chartHeight,
    } = chartLayout;

    // Setting up the scales

    const xScale = d3
      .scaleBand()
      .domain(
        d3.groupSort(
          datapoints,
          ([d]) => -d.date,
          (d) => d.id
        )
      )
      .rangeRound([
        chartMarginLeft,
        chartMarginLeft + barWidth * (barsCount + 1 + barPadding),
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
      .attr("fill", () =>
        getChartBarColor({
          entryTypeId: props.entryTypeId,
          theme,
        })
      )
      .selectAll()
      .data(datapoints)
      .join("rect")
      .attr("x", (datapoint) => xScale(datapoint.id) as number)
      .attr("y", (datapoint) => yScale(0)) // Set to 0 to animate bars from bottom to top
      .attr("height", 0) // Set to 0 to animate bars from bottom to top
      .attr("width", xScale.bandwidth())
      .attr("class", "bar")
      .attr("id", (datapoint) => `bar-${datapoint.id}`);

    // Adding the bottom x-axis with date labels

    const bottomXAxis = d3
      .axisBottom(xScale)
      .tickFormat((id) => {
        const date = getDatapointDate(id as string, datapoints);
        if (date == null) return "";
        return valueFormatter(
          date,
          "x",
          props.timePeriod,
          props.xAxisUnit,
          props.yAxisType,
          yAxisUnit
        );
      })
      .tickSizeOuter(0);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight - chartMarginBottom})`)
      .call(bottomXAxis)
      .call((g) => g.select(".domain").attr("transform", `translate(0,0)`))
      .selectAll("text")
      .attr("font-size", mainFontSize)
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
      .tickFormat((id: string) => {
        const value = getDatapointsValue({
          id,
          datapoints,
        });
        if (value === 0) {
          return "";
        }
        return valueFormatter(
          value,
          "x",
          props.timePeriod,
          props.xAxisUnit,
          props.yAxisType,
          yAxisUnit
        );
      })
      .tickSizeOuter(0);

    svg
      .append("g")
      .attr("transform", `translate(0, ${chartMarginTop})`)
      .call(topXAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .selectAll("text")
      .attr("transform", (id) => {
        if (id == null) return "";
        const y =
          yScale(
            getDatapointsValue({
              id: id as string,
              datapoints,
            })
          ) -
          (spacing * 2 + mainFontSize);
        return `translate(0, ${y})`;
      })
      .style("font-size", secondaryFontSize)
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
            return valueFormatter(
              y as number,
              "y",
              props.timePeriod,
              props.xAxisUnit,
              props.yAxisType,
              yAxisUnit
            );
          })
          .ticks(getYAxisTicksCount(max, props.yAxisType, props.xAxisUnit))
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
            return valueFormatter(
              y as number,
              "y",
              props.timePeriod,
              props.xAxisUnit,
              props.yAxisType,
              yAxisUnit
            );
          })
          .ticks(getYAxisTicksCount(max, props.yAxisType, props.xAxisUnit))
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
        .attr("y", (datapoint) =>
          yScale((datapoint as BarChartDatapoint).value)
        )
        .attr(
          "height",
          (datapoint) =>
            yScale(0) - yScale((datapoint as BarChartDatapoint).value)
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
    theme,
    datapoints,
    props,
    barsCount,
    chartLayout,
    chartId,
    yAxisUnit,
    min,
    max,
    id,
  ]);

  const renderSVG = (id: string, ref: React.RefObject<SVGSVGElement>) => (
    <svg
      id={id}
      ref={ref}
      width={chartLayout.chartWidth}
      height={chartLayout.chartHeight}
      viewBox={`0 0 ${chartLayout.chartWidth} ${chartLayout.chartHeight}`}
      style={{
        outline: "none",
      }}
    ></svg>
  );

  return (
    <Stack>
      <ChartHeader
        entryType={props.entryTypeId}
        yAxisUnit={yAxisUnit}
        xAxisUnit={props.xAxisUnit}
        yAxisType={props.yAxisType}
        datapoints={datapoints}
      />

      <Box
        id={outerContainerId}
        sx={{
          maxHeight: chartLayout.chartContainerHeight,
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
            height: chartLayout.chartHeight,
            width: chartLayout.chartMarginLeft,
            borderRadius: 0,
            boxShadow: "none",
            backgroundColor: props.backgroundColor,
          }}
        />
        {renderSVG(chartSVGOverlayId, svgOverlayRef)}
      </Box>
    </Stack>
  );
}
