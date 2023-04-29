import { Container } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import BottomBar from "../../common/components/BottomBar";
import TopBar from "../../common/components/TopBar";
import { CSSBreakpoint, PageName } from "../../lib/enums";
import { getPath } from "../../lib/utils";
import Calendar from "../../pages/Calendar";
import Entry from "../../pages/Entry";
import Home from "../../pages/Home";
import Settings from "../../pages/Settings";
import Stats from "../../pages/Stats";
import "./App.scss";

export default function App() {
  return (
    <>
      <TopBar component={"header"} />

      <Container
        component={"main"}
        sx={{
          maxWidth: {
            [CSSBreakpoint.Small]: CSSBreakpoint.Medium,
          },
          paddingTop: 2,
          paddingBottom: 8,
        }}
      >
        {/* {userIsSignedIn ? <PrivateRoutes /> : <PublicRoutes />} */}
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="*" element={<Navigate replace to="" />} />
          <Route path={getPath({ page: PageName.Home })} element={<Home />} />
          <Route path={getPath({ page: PageName.Stats })} element={<Stats />} />
          <Route
            path={getPath({ page: PageName.Calendar })}
            element={<Calendar />}
          />
          <Route
            path={getPath({ page: PageName.Settings })}
            element={<Settings />}
          />
          <Route path={getPath({ page: PageName.Entry })}>
            <Route path="" element={<Entry />} />
            <Route path="*" element={<Navigate replace to="" />} />
            <Route path=":entryId" element={<Entry />} />
          </Route>
        </Routes>
      </Container>

      <BottomBar component={"footer"} />
    </>
  );
}
