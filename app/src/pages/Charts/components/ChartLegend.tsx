import { Box, Stack } from "@mui/material";
import ChartLegendItem, {
  ChartLegendItemProps,
} from "@/pages/Charts/components/ChartLegendItem";

import React from "react";

type Props = {
  items: ChartLegendItemProps[];
};

export function ChartLegend(props: Props) {
  if (!props.items || !props.items.length) {
    return null;
  }

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      flexWrap="wrap"
      width="100%"
      spacing={2}
    >
      {props.items.map((item, index) => {
        return <ChartLegendItem key={index} {...item} />;
      })}
    </Stack>
  );
}
