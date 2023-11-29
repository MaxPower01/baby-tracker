import { BottomBar } from "@/components/BottomBar";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { Container } from "@mui/material";
import { MenuProvider } from "@/components/Menu/MenuProvider";
import { PrivateRoutes } from "@/components/PrivateRoutes";
import { PublicRoutes } from "@/components/PublicRoutes";
import { TopBar } from "@/components/TopBar";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useEffect } from "react";

let didInit = false;

export function App() {
  const { user } = useAuthentication();

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // Code here will run only once per app load
    }
  }, []);

  return (
    <>
      {user != null && <TopBar component={"header"} />}

      <Container
        component={"main"}
        maxWidth={CSSBreakpoint.Small}
        sx={{
          paddingTop: 2,
          paddingBottom: 20,
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
