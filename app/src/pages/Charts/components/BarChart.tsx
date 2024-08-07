import React, { useEffect, useMemo, useRef } from "react";

import { Box } from "@mui/material";
import { barChartContainerMaxHeight } from "@/utils/constants";
import d3 from "d3";
import { v4 as uuid } from "uuid";

const data = [
  {
    date: "2024-08-07T00:00:00.000Z",
    value: 1,
  },
  {
    date: "2024-08-07T01:00:00.000Z",
    value: 12,
  },
  {
    date: "2024-08-07T02:00:00.000Z",
    value: 10,
  },
  {
    date: "2024-08-07T03:00:00.000Z",
    value: 7,
  },
  {
    date: "2024-08-07T04:00:00.000Z",
    value: 5,
  },
  {
    date: "2024-08-07T05:00:00.000Z",
    value: 6,
  },
  {
    date: "2024-08-07T06:00:00.000Z",
    value: 9,
  },
  {
    date: "2024-08-07T07:00:00.000Z",
    value: 7,
  },
  {
    date: "2024-08-07T08:00:00.000Z",
    value: 5,
  },
  {
    date: "2024-08-07T09:00:00.000Z",
    value: 4,
  },
  {
    date: "2024-08-07T10:00:00.000Z",
    value: 3,
  },
  {
    date: "2024-08-07T11:00:00.000Z",
    value: 9,
  },
  {
    date: "2024-08-07T12:00:00.000Z",
    value: 11,
  },
  {
    date: "2024-08-07T13:00:00.000Z",
    value: 10,
  },
  {
    date: "2024-08-07T14:00:00.000Z",
    value: 6,
  },
  {
    date: "2024-08-07T15:00:00.000Z",
    value: 6,
  },
  {
    date: "2024-08-07T16:00:00.000Z",
    value: 3,
  },
  {
    date: "2024-08-07T17:00:00.000Z",
    value: 1,
  },
  {
    date: "2024-08-07T18:00:00.000Z",
    value: 0,
  },
  {
    date: "2024-08-07T19:00:00.000Z",
    value: 5,
  },
  {
    date: "2024-08-07T20:00:00.000Z",
    value: 7,
  },
  {
    date: "2024-08-07T21:00:00.000Z",
    value: 3,
  },
  {
    date: "2024-08-07T22:00:00.000Z",
    value: 11,
  },
  {
    date: "2024-08-07T23:00:00.000Z",
    value: 3,
  },
];

type Props = {
  data: { date: string; value: number }[];
  width: number;
  height: number;
};

export function BarChart(props: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const chartRef = useRef<boolean>(false);

  const id = useMemo(() => uuid(), []);
  const chartId = `bar-chart-${id}`;
  const outerContainerId = `${chartId}-outer-container`;
  const innerContainerId = `${chartId}-inner-container`;

  useEffect(() => {
    if (!svgRef.current || chartRef.current) return;

    chartRef.current = true;

    const svg = d3.select(svgRef.current);

    // Chart rendering logic here (same as before)
    // ...
  }, []);

  return (
    <Box id={outerContainerId} sx={{ maxHeight: barChartContainerMaxHeight }}>
      <Box
        id={innerContainerId}
        sx={{
          position: "relative",
        }}
      >
        <svg
          id={chartId}
          ref={svgRef}
          width={props.width}
          height={props.height}
        ></svg>
      </Box>
    </Box>
  );
}
