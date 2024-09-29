import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
  useTheme,
} from "@mui/material";

import React from "react";

export function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{
            color: theme.customPalette.text.secondary,
          }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
