import { Container } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import BottomBar from "../../common/components/BottomBar";
import TopBar from "../../common/components/TopBar";
import { CSSBreakpoint, PageName } from "../../lib/enums";
import { getPath } from "../../lib/utils";
import CalendarPage from "../../pages/CalendarPage";
import EntryPage from "../../pages/EntryPage";
import GraphicsPage from "../../pages/GraphicsPage";
import HomePage from "../../pages/HomePage";
import MorePage from "../../pages/MorePage";
import "./App.scss";

export default function App() {
  return (
    <>
      <TopBar component={"header"} />

      <Container
        component={"main"}
        maxWidth={CSSBreakpoint.Small}
        sx={{
          paddingTop: 2,
          paddingBottom: 8,
        }}
      >
        {/* {userIsSignedIn ? <PrivateRoutes /> : <PublicRoutes />} */}
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="*" element={<Navigate replace to="" />} />
          <Route
            path={getPath({ page: PageName.Home })}
            element={<HomePage />}
          />
          <Route
            path={getPath({ page: PageName.Graphics })}
            element={<GraphicsPage />}
          />
          <Route
            path={getPath({ page: PageName.Calendar })}
            element={<CalendarPage />}
          />
          <Route
            path={getPath({ page: PageName.Menu })}
            element={<MorePage />}
          />
          <Route path={getPath({ page: PageName.Entry })}>
            <Route path="" element={<EntryPage />} />
            <Route path="*" element={<Navigate replace to="" />} />
            <Route path=":entryId" element={<EntryPage />} />
          </Route>
        </Routes>
      </Container>

      <BottomBar component={"footer"} />
    </>
  );
}
