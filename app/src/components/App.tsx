import { Container, useTheme } from "@mui/material";

import { BottomBar } from "@/components/BottomBar";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { MenuProvider } from "@/components/MenuProvider";
import { PrivateRoutes } from "@/components/PrivateRoutes";
import { PublicRoutes } from "@/components/PublicRoutes";
import { TopBar } from "@/components/TopBar";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEffect } from "react";

let didInit = false;
let didInitUser = false;

export function App() {
  const { user } = useAuthentication();
  const babyId = user?.babyId ?? "";
  const dispatch = useAppDispatch();
  const theme = useTheme();

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // Code here will run only once per app load
    }
  }, []);

  useEffect(() => {
    if (!isNullOrWhiteSpace(babyId) && !didInitUser) {
      didInitUser = true;
      // Code here will run only once per app load if the user is not null
    }
  }, [user, babyId, dispatch]);

  return (
    <>
      {user != null && <TopBar component={"header"} />}

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
        {user == null ? <PublicRoutes /> : <PrivateRoutes />}
      </Container>

      {user != null && (
        <MenuProvider>
          <BottomBar component={"footer"} />
        </MenuProvider>
      )}
    </>
  );
}
