import { Container } from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BottomBar from "../../common/BottomBar";
import TopBar from "../../common/TopBar";
import { CSSBreakpoint } from "../../lib/enums";
import Home from "../../pages/Home";
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
          <Route path="/home" element={<Home />} />
        </Routes>
      </Container>

      {shouldRenderBottomBar && <BottomBar component={"footer"} />}
    </>
  );
}
