import React, { useEffect, useRef } from "react";

import d3 from "d3";

type Props = {
  timeScale: "hours" | "days";
};

const data = [
  { date: "2023-01-01", value: 30 },
  { date: "2023-01-02", value: 50 },
  { date: "2023-01-03", value: 40 },
  { date: "2023-01-04", value: 60 },
  { date: "2023-01-05", value: 70 },
  { date: "2023-01-06", value: 90 },
];

const width = 1000;
const height = 500;

export function DiaperChart(props: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f9f9f9")
      .style("margin", "50px")
      .style("overflow", "visible");

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g").call(xAxis).attr("transform", `translate(0, ${height})`);

    svg.append("g").call(yAxis);

    const lineFunction = d3
      .line<{ date: string; value: number }>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", lineFunction);
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
}
