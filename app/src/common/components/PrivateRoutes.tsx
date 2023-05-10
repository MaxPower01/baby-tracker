import PageName from "@/common/enums/PageName";
import { getPath } from "@/lib/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import AuthenticationPage from "@/pages/AuthenticationPage";
import CalendarPage from "@/pages/CalendarPage";
import ChildrenPage from "@/pages/ChildrenPage";
import EntryPage from "@/pages/EntryPage";
import GraphicsPage from "@/pages/GraphicsPage";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function PrivateRoutes() {
  const { user } = useAuthentication();

  return (
    <Routes>
      <>
        <Route
          path={getPath({ page: PageName.Children })}
          element={<ChildrenPage />}
        />
        <Route path="" element={<HomePage />} />
        <Route path="*" element={<Navigate replace to="" />} />
        <Route path={getPath({ page: PageName.Home })} element={<HomePage />} />
        <Route
          path={getPath({ page: PageName.Graphics })}
          element={<GraphicsPage />}
        />
        <Route
          path={getPath({ page: PageName.Calendar })}
          element={<CalendarPage />}
        />
        <Route path={getPath({ page: PageName.Menu })} element={<MenuPage />} />
        <Route
          path={getPath({ page: PageName.Authentication })}
          element={<AuthenticationPage />}
        />
        <Route path={getPath({ page: PageName.Entry })}>
          <Route path="" element={<EntryPage />} />
          <Route path="*" element={<Navigate replace to="" />} />
          <Route path=":entryId" element={<EntryPage />} />
        </Route>
      </>
    </Routes>
  );
}
