import LoadingIndicator from "@/common/components/LoadingIndicator";
import ActivityType from "@/modules/activities/enums/ActivityType";
import ActivityModel from "@/modules/activities/models/ActivityModel";
import useEntries from "@/modules/entries/hooks/useEntries";
import { Typography, useTheme } from "@mui/material";
import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";

interface DataPoint {
  date: Date;
  value: number;
}

type Props = {
  activityType: ActivityType;
};

export default function ActivityBarChart(props: Props) {
  const { entries, isLoading } = useEntries();
  const activityEntries = useMemo(
    () =>
      entries.filter((entry) => {
        return entry.activity?.type == props.activityType;
      }),
    [entries]
  );
  const chartRef = useRef<SVGSVGElement | null>(null);
  const theme = useTheme();

  const drawChart = () => {
    const datesArray = generateDatesArray().reverse();
    const data: DataPoint[] = datesArray.map((date) => ({
      date,
      value: 0,
    }));

    for (const entry of activityEntries) {
      const dataPoint = {
        date: mapStartDateToClosestDate(entry.startDate, datesArray),
        value: entry.time,
      };
      const index = data.findIndex((d) => d.date == dataPoint.date);
      data[index].value += dataPoint.value;
    }

    // Get the range of the data
    const dataRange = d3.extent(data, (d) => d.value) as [number, number];

    // Get the width of the container element
    const containerWidth = chartRef.current?.parentElement?.clientWidth || 0;

    // Define the chart dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 100 };
    const width = containerWidth;
    const numDataPoints = data.length;
    const height = numDataPoints * 20 + margin.top + margin.bottom;

    // Calculate the inner width and height of the chart
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the x and y scales
    const xScale = d3
      .scaleLinear()
      .domain(dataRange) // Set the range of the x scale
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand<Date>()
      .domain(datesArray) // Set the range of the y scale to an array of dates
      .range([0, innerHeight])
      .padding(0.1);

    // Create the chart SVG element
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create the chart container group element
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create a color scale
    const colorScale = d3
      .scaleSequential()
      .domain([0, 60]) // Set the domain of the color scale to match the value range
      .interpolator(d3.interpolateRgb("blue", "red")); // Set the color range

    // Create the bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d.date) as any)
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth())
      .attr("fill", theme.palette.primary.main);

    // Create the x-axis
    const xAxis = d3.axisBottom(xScale);
    chart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    // Apply text color to x-axis tick labels using CSS and opacity
    chart
      .selectAll(".x-axis text")
      .style("fill", theme.palette.text.primary)
      .style("display", "none");
    // .style("opacity", 0.5); // Set the desired text color

    // chart.select(".x-axis").style("display", "none");

    // Create the y-axis
    const yAxis = d3
      .axisLeft<Date>(yScale)
      .tickFormat(d3.timeFormat("%Y-%m-%d %H:%M")); // Format y-axis labels as HH:MM

    chart.append("g").attr("class", "y-axis").call(yAxis);

    // Apply text color to y-axis tick labels using CSS
    chart.selectAll(".y-axis text").style("fill", theme.palette.text.primary);
    // .style("opacity", 0.5); // Set the desired text color
  };

  useEffect(() => {
    if (!isLoading && activityEntries.length > 0) {
      drawChart();
    } else {
      // Clear the chart
      d3.select(chartRef.current).selectAll("*").remove();
    }
  }, [isLoading, entries, activityEntries]);

  // Generate an array of dates, 30 minutes apart, representing the last 24 hours
  const generateDatesArray = (): Date[] => {
    const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    startDate.setMinutes(Math.floor(startDate.getMinutes() / 15) * 15, 0, 0); // Round down to the nearest quarter hour
    const endDate = new Date();

    const datesArray: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      datesArray.push(currentDate);
      // currentDate = new Date(currentDate.getTime() + 30 * 60 * 1000); // 30 minutes interval
      currentDate = new Date(currentDate.getTime() + 15 * 60 * 1000); // 15 minutes interval
    }

    return datesArray;
  };

  // Generate mock data
  const generateData = (): DataPoint[] => {
    return generateDatesArray().map((date) => ({
      date,
      // value: Math.random() * 60, // Random value between 0 and 60
      //Half the time, value should be 0
      // value: Math.random() < 0.5 ? 0 : Math.random() * 60, // Random value between 0 and 60
      value: 0,
    }));
  };

  const mapStartDateToClosestDate = (
    startDate: Date,
    datesArray: Date[]
  ): Date => {
    let closestDate = datesArray[0];
    let minDiff = Math.abs(startDate.getTime() - closestDate.getTime());

    for (let i = 1; i < datesArray.length; i++) {
      const diff = Math.abs(startDate.getTime() - datesArray[i].getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestDate = datesArray[i];
      }
    }

    return closestDate;
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (activityEntries.length === 0) {
    return (
      <Typography variant="body1" textAlign={"center"}>
        Aucune entrée n'a été enregistrée pour les dernières 24 heures pour
        l'acvitité sélectionnée.
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h6" textAlign={"center"} fontWeight={"bold"}>
        {new ActivityModel(props.activityType).name}
      </Typography>
      <Typography variant="body1" textAlign={"center"}>
        Entrées des dernières 24 heures
      </Typography>
      <svg ref={chartRef}></svg>
    </>
  );
}
