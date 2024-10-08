import { Container, useTheme } from "@mui/material";

import { BottomBar } from "@/components/BottomBar";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { Main } from "@/components/Main";
import { MenuProvider } from "@/components/MenuProvider";
import React from "react";
import { TopBar } from "@/components/TopBar";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";

type Props = React.PropsWithChildren<{
  hideTopBar?: boolean;
  hideBottomBar?: boolean;
}>;

export function PageLayout(props: Props) {
  const { user } = useAuthentication();
  const theme = useTheme();

  return (
    <>
      {props.hideTopBar != true && <TopBar component="header" />}

      <Container
        component={"main"}
        maxWidth={CSSBreakpoint.Small}
        sx={{
          paddingTop: 2,
          paddingBottom: 20,
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

      <MenuProvider>
        <BottomBar component={"footer"} />
      </MenuProvider>
    </>
  );
}
