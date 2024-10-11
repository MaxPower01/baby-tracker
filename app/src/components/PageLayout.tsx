import { BottomBar, BottomBarProps } from "@/components/BottomBar";
import { Container, useTheme } from "@mui/material";
import { TopBar, TopBarProps } from "@/components/TopBar";

import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { MenuProvider } from "@/components/MenuProvider";
import React from "react";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";

type Props = React.PropsWithChildren<{
  topBarProps?: TopBarProps;
  OverrideTopBar?: React.ElementType;
  bottomBarProps?: BottomBarProps;
  OverrideBottomBar?: React.ElementType;
}>;

export function PageLayout(props: Props) {
  const { user } = useAuthentication();
  const theme = useTheme();

  return (
    <>
      {props.OverrideTopBar == null && <TopBar {...props.topBarProps} />}

      {props.OverrideTopBar != null && <props.OverrideTopBar />}

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

      {props.OverrideBottomBar == null && (
        <MenuProvider>
          <BottomBar {...props.bottomBarProps} />
        </MenuProvider>
      )}

      {props.OverrideBottomBar != null && <props.OverrideBottomBar />}
    </>
  );
}
