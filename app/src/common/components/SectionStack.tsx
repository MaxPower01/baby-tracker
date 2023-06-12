import React from "react";
import { Stack } from "@mui/material";

export default function SectionStack(props: React.PropsWithChildren<{}>) {
  return (
    <Stack
      spacing={0}
      alignItems="center"
      sx={{
        width: "100%",
      }}
    >
      {props.children}
    </Stack>
  );
}
