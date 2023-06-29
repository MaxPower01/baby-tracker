import { Navigate, Route, Routes } from "react-router-dom";

import ActivitiesPage from "@/pages/ActivitiesPage";
import AuthenticationPage from "@/pages/AuthenticationPage";
import ChildPage from "@/pages/ChildPage";
import EntriesPage from "@/pages/EntriesPage";
import EntryPage from "@/pages/EntryPage";
import FamilyPage from "@/pages/FamilyPage";
import GraphicsPage from "@/pages/GraphicsPage";
import HomePage from "@/pages/HomePage";
import PageId from "@/common/enums/PageId";
import SettingsPage from "@/pages/SettingsPage";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
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
