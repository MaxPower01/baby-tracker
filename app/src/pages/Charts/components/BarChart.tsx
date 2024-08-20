import * as d3 from "d3";

import { Box, Paper, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";

import { chartHeight } from "@/utils/constants";
import { v4 as uuid } from "uuid";

type Datapoint = {
  id: string;
  date: Date;
  value: number;
};

const generateMockData = (count: number): Datapoint[] => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: uuid(),
      date: new Date(new Date().setHours(i, 0, 0, 0)),
      value: Math.floor(Math.random() * 10),
    });
  }
  return data;
};

type Props = {
  // data: Datapoint[];
  backgroundColor: string;
  barColor?: string | string[];
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

  const data = generateMockData(24);

  const barsCount = data.length;
  const barWidth = 40;
  const spacing = 8;
  const fontSize = barWidth / 3;
  const chartMarginTop = spacing * 2 + fontSize;
  const chartMarginRight = spacing;
  const chartMarginLeft = spacing * 4;
  const chartMarginBottom = spacing * 8;
  const chartContainerHeight = chartHeight + chartMarginTop + chartMarginBottom;
  const chartWidth =
    barWidth * (barsCount + 1) + chartMarginLeft + chartMarginRight;
  const barPadding = 0.25;

  const getBarColor = () => {
    if (props.barColor instanceof Array) {
      return props.barColor[0];
    }
    return props.barColor || theme.palette.primary.main;
  };

  useEffect(() => {
    if (!svgRef.current || chartRef.current) return;

    chartRef.current = true;

    const datapoints = data.sort((a, b) => d3.ascending(a.date, b.date));

    const getValueById = (id: string) => {
      const dataPoint = data.find((d) => d.id === id);
      return dataPoint ? dataPoint.value : 0;
    };

    const getDateById = (id: string) => {
      const dataPoint = data.find((d) => d.id === id);
      return dataPoint ? dataPoint.date : new Date();
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
        chartMarginLeft + barWidth * (barsCount + 1 + barPadding),
      ])
      .padding(barPadding);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(datapoints, (d) => d.value) as number])
      .nice()
      .range([chartHeight - chartMarginBottom, chartMarginTop]);

    // Setting up the SVGs

    const svg = d3.select(svgRef.current);
    const svgOverlay = d3.select(svgOverlayRef.current);

    // Adding rectangles for each bar

    svg
      .append("g")
      .attr("fill", () => getBarColor())
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

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight - chartMarginBottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSizeOuter(0)
          .tickFormat((id) => {
            const date = getDateById(id as string);
            return date.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });
          })
      )
      .selectAll("text")
      .attr("font-size", fontSize)
      .attr("transform", "translate(-10,5)rotate(-45)")
      .style("text-anchor", "end")
      .style("alignment-baseline", "middle")
      .attr("class", "x-axis-label");

    // Adding the top x-axis with value labels

    svg
      .append("g")
      .attr("transform", `translate(0, ${chartMarginTop})`)
      .call(
        d3
          .axisTop(xScale)
          .tickFormat((id) => getValueById(id).toString())
          .tickSizeOuter(0)
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .selectAll("text")
      .attr("transform", (id) => {
        if (id == null) return "";
        const y = yScale(getValueById(id as string)) - (spacing * 2 + fontSize);
        return `translate(0, ${y})`;
      })
      .style("font-size", fontSize)
      .style("font-weight", "bold")
      .style("text-anchor", "middle")
      .attr("class", "bar-value-label")
      .style("opacity", 0); // Hide the labels until the bars are animated

    // Adding the y-axis

    svg
      .append("g")
      .style("opacity", 0) // A fixed y-axis is added in the overlay SVG, so this one is hidden
      .attr("transform", `translate(${chartMarginLeft},0)`)
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).tickFormat((y) => (y as number).toFixed()))
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
      .call(d3.axisLeft(yScale).tickFormat((y) => (y as number).toFixed()))
      .call((g: any) =>
        g
          .selectAll(".tick")
          .attr("class", "y-axis-tick")
          .attr("font-size", fontSize)
      )
      .call((g: any) =>
        g
          .selectAll(".tick text")
          .attr("font-weight", "bold")
          .attr("class", "y-axis-label")
          .attr("font-size", fontSize)
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
        .delay((datapoint, index) => index * 50)
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
  }, []);

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
          // scrollbarWidth: "none",
          // msOverflowStyle: "none",
          // "&::-webkit-scrollbar": {
          //   display: "none",
          // },
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
