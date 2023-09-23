import { Stack, SxProps } from "@mui/material";

import React from "react";

export default function SectionStack(
  props: React.PropsWithChildren<{ sx?: SxProps }>
) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{
        width: "100%",
        ...props.sx,
      }}
    >
      {props.children}
    </Stack>
  );
}
