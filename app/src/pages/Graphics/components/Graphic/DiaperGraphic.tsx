import React, { useEffect, useRef } from "react";
import {
  axisBottom,
  axisLeft,
  curveCardinal,
  curveMonotoneX,
  extent,
  line,
  max,
  scaleLinear,
  scaleTime,
  select,
} from "d3";

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

export function DiaperGraphic(props: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f9f9f9")
      .style("margin", "50px")
      .style("overflow", "visible");

    const x = scaleTime()
      .domain(extent(data, (d) => new Date(d.date)) as [Date, Date])
      .range([0, width]);

    const y = scaleLinear()
      .domain([0, max(data, (d) => d.value) as number])
      .range([height, 0]);

    const xAxis = axisBottom(x);
    const yAxis = axisLeft(y);

    svg.append("g").call(xAxis).attr("transform", `translate(0, ${height})`);

    svg.append("g").call(yAxis);

    const lineFunction = line<{ date: string; value: number }>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value))
      .curve(curveMonotoneX);

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
