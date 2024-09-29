import { Container, useTheme } from "@mui/material";

import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { PrivateRoutes } from "@/components/PrivateRoutes";
import { PublicRoutes } from "@/components/PublicRoutes";
import React from "react";

type Props = React.PropsWithChildren<{}>;

export function Main(props: Props) {
  const theme = useTheme();

  return (
    <Container
      component={"main"}
      maxWidth={CSSBreakpoint.Small}
      sx={{
        paddingTop: 2,
        paddingBottom: 20,
        // Default scrollbar styles
        "& *": {
          "&::-webkit-scrollbar": {
            width: "5em",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
            transition: theme.transitions.create("box-shadow", {
              duration: theme.transitions.duration.shortest,
            }),
          },
          "&::-webkit-scrollbar-thumb:hover": {
            boxShadow: `inset 0 0 0 20px ${theme.palette.action.hover}`,
          },
        },
      }}
    >
      {props.children}
    </Container>
  );
}
