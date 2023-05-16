import PageName from "@/common/enums/PageName";
import { getPath, isNullOrWhiteSpace } from "@/lib/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import AuthenticationPage from "@/pages/AuthenticationPage";
import ChildPage from "@/pages/ChildPage";
import ChildrenPage from "@/pages/ChildrenPage";
import EntriesPage from "@/pages/EntriesPage";
import EntryPage from "@/pages/EntryPage";
import GraphicsPage from "@/pages/GraphicsPage";
import HomePage from "@/pages/HomePage";
import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

export default function PrivateRoutes() {
  const { user, children } = useAuthentication();
  const selectedChild = useMemo(() => {
    return (
      children.find((child) => child.isSelected)?.id ??
      user?.selectedChild ??
      ""
    );
  }, [user, children]);
  return (
    <Routes>
      <>
        {isNullOrWhiteSpace(selectedChild) == true && (
          <>
            <Route path="*" element={<ChildPage />} />
          </>
        )}
        {isNullOrWhiteSpace(selectedChild) == false && (
          <>
            <Route
              path={getPath({ page: PageName.Children })}
              element={<ChildrenPage />}
            />
            <Route
              path={getPath({ page: PageName.Child })}
              element={<ChildPage />}
            />
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
              path={getPath({ page: PageName.Entries })}
              element={<EntriesPage />}
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
          </>
        )}
      </>
    </Routes>
  );
}
