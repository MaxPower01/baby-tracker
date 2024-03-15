import { Stack, SxProps } from "@mui/material";

import React from "react";

export function SectionStack(props: React.PropsWithChildren<{ sx?: SxProps }>) {
  return (
    <Stack
      spacing={4}
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
