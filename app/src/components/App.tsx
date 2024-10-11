import { Container, useTheme } from "@mui/material";
import { useEffect, useMemo } from "react";

import { BottomBar } from "@/components/BottomBar";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { MenuProvider } from "@/components/MenuProvider";
import { PrivateRoutes } from "@/components/PrivateRoutes";
import { PublicRoutes } from "@/components/PublicRoutes";
import { TopBar } from "@/components/TopBar";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { topbarContainerId } from "@/utils/constants";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/pages/Authentication/components/AuthenticationProvider";

let didInit = false;
let didInitUser = false;

export function App() {
  const { user } = useAuthentication();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // Code here will run only once per app load
    }
  }, []);

  useEffect(() => {
    if (!isNullOrWhiteSpace(user?.babyId) && !didInitUser) {
      didInitUser = true;
      // Code here will run only once per app load if the user is not null
    }
  }, [user, dispatch]);

  return <>{user == null ? <PublicRoutes /> : <PrivateRoutes />}</>;
}
