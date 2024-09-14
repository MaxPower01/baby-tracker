import { Box, Stack, Typography, useTheme } from "@mui/material";

import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisUnit } from "@/types/YAxisUnit";

export type ChartLegendItemProps = {
  dotColor: string;
  textColor: string;
  labelText: string;
  valueText: string;
};

export default function ChartLegendItem(props: ChartLegendItemProps) {
  const theme = useTheme();

  return (
    <Stack>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
        }}
      >
        {props.valueText}
      </Typography>
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        spacing={1}
      >
        <Box
          style={{
            width: 10,
            height: 10,
            backgroundColor: props.dotColor,
            borderRadius: "50%",
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: props.textColor, fontWeight: 400 }}
        >
          {props.labelText}
        </Typography>
      </Stack>
    </Stack>
  );
}
