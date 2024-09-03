import { BarChartLegendItemProps } from "@/pages/Charts/types/BarChartLegendItemProps";
import { Box } from "@mui/material";
import React from "react";

type Props = {
  items: BarChartLegendItemProps[];
};

export function BarChartLegend(props: Props) {
  if (!props.items || !props.items.length) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      {props.items.map((item, index) => {
        return <Box key={index}>{item.value}</Box>;
      })}
    </Box>
  );
}
