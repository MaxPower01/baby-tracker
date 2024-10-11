import { Container, useTheme } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useMemo } from "react";

import { BottomBar } from "@/components/BottomBar";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { LandingPage } from "@/pages/Landing/LandingPage";
import { MenuProvider } from "@/components/MenuProvider";
import { PageId } from "@/enums/PageId";
import { PrivateRoutes } from "@/components/PrivateRoutes";
import { PublicRoutes } from "@/components/PublicRoutes";
import { TopBar } from "@/components/TopBar";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { topbarContainerId } from "@/utils/constants";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";

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

  return (
    <>
      <Routes>
        <Route
          path={getPath({ page: PageId.Landing })}
          element={<LandingPage />}
        />
        <Route
          path="*"
          element={<Navigate replace to={getPath({ page: PageId.Landing })} />}
        />
      </Routes>

      {user == null ? <PublicRoutes /> : <PrivateRoutes />}
    </>
  );
}
