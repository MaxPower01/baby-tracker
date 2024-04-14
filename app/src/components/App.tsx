import { BottomBar } from "@/components/BottomBar";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { Container } from "@mui/material";
import { MenuProvider } from "@/components/MenuProvider";
import { PrivateRoutes } from "@/components/PrivateRoutes";
import { PublicRoutes } from "@/components/PublicRoutes";
import { TopBar } from "@/components/TopBar";
import { fetchRecentEntriesFromDB } from "@/state/slices/entriesSlice";
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
      dispatch(fetchRecentEntriesFromDB({ babyId }));
    }
  }, [user]);

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
