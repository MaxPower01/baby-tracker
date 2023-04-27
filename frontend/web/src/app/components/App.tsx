import { Container } from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BottomBar from "../../common/BottomBar";
import TopBar from "../../common/TopBar";
import { CSSBreakpoint, PageName } from "../../lib/enums";
import { getPath } from "../../lib/utils";
import Calendar from "../../pages/Calendar";
import Home from "../../pages/Home";
import Settings from "../../pages/Settings";
import Stats from "../../pages/Stats";
import "./App.scss";

export default function App() {
  /* -------------------------------------------------------------------------- */
  /*                                    Setup                                   */
  /* -------------------------------------------------------------------------- */

  const [shouldRenderTopBar, setShouldRenderTopBar] = useState(true);
  const [shouldRenderBottomBar, setShouldRenderBottomBar] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      {shouldRenderTopBar && <TopBar component={"header"} />}

      <Container
        component={"main"}
        sx={{
          maxWidth: {
            [CSSBreakpoint.Small]: CSSBreakpoint.Medium,
          },
          paddingTop: 3,
          paddingBottom: shouldRenderBottomBar ? 12 : 3,
        }}
      >
        {/* {userIsSignedIn ? <PrivateRoutes /> : <PublicRoutes />} */}
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="*" element={<Navigate replace to="" />} />
          <Route path={getPath(PageName.Home)} element={<Home />} />
          <Route path={getPath(PageName.Stats)} element={<Stats />} />
          <Route path={getPath(PageName.Calendar)} element={<Calendar />} />
          <Route path={getPath(PageName.Settings)} element={<Settings />} />
        </Routes>
      </Container>

      {shouldRenderBottomBar && <BottomBar component={"footer"} />}
    </>
  );
}
