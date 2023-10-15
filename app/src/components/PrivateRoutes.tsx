import { Navigate, Route, Routes } from "react-router-dom";

import ActivitiesPage from "@/pages/Activities";
import AuthenticationPage from "@/pages/Authentication";
import ChildPage from "@/pages/Baby";
import EntriesPage from "@/pages/Entries";
import EntryPage from "@/pages/Entry";
import FamilyPage from "@/pages/Family";
import GraphicsPage from "@/pages/Graphics";
import HomePage from "@/pages/Home";
import PageId from "@/enums/PageId";
import SettingsPage from "@/pages/Settings";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import useAuthentication from "@/pages/Authentication/hooks/useAuthentication";
import { useMemo } from "react";

export default function PrivateRoutes() {
  const { user } = useAuthentication();
  const selectedChild = useMemo(() => {
    return user?.selectedChild ?? "";
  }, [user]);
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
              path={getPath({ page: PageId.Family })}
              element={<FamilyPage />}
            />

            <Route path="" element={<HomePage />} />
            <Route path="*" element={<Navigate replace to="" />} />
            <Route
              path={getPath({ page: PageId.Home })}
              element={<HomePage />}
            />
            <Route
              path={getPath({ page: PageId.Graphics })}
              element={<GraphicsPage />}
            />
            <Route
              path={getPath({ page: PageId.Entries })}
              element={<EntriesPage />}
            />
            <Route
              path={getPath({ page: PageId.Authentication })}
              element={<AuthenticationPage />}
            />
            <Route
              path={getPath({ page: PageId.Settings })}
              element={<SettingsPage />}
            />
            <Route
              path={getPath({ page: PageId.Activities })}
              element={<ActivitiesPage />}
            />
            <Route path={getPath({ page: PageId.Entry })}>
              <Route path="" element={<EntryPage />} />
              <Route path="*" element={<Navigate replace to="" />} />
              <Route path=":entryId" element={<EntryPage />} />
            </Route>
            <Route path={getPath({ page: PageId.Child })}>
              <Route path="" element={<ChildPage />} />
              <Route path="*" element={<Navigate replace to="" />} />
              <Route path=":childId" element={<ChildPage />} />
            </Route>
          </>
        )}
      </>
    </Routes>
  );
}
