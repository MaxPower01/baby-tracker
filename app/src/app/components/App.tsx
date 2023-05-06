import BottomBar from "@/common/components/BottomBar";
import TopBar from "@/common/components/TopBar";
import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import PageName from "@/common/enums/PageName";
import { getPath } from "@/lib/utils";
import AuthenticationPage from "@/pages/AuthenticationPage";
import CalendarPage from "@/pages/CalendarPage";
import EntryPage from "@/pages/EntryPage";
import GraphicsPage from "@/pages/GraphicsPage";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import { Container } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
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
            element={<MenuPage />}
          />
          <Route
            path={getPath({ page: PageName.Authentication })}
            element={<AuthenticationPage />}
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
