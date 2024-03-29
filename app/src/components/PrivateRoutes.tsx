import { Navigate, Route, Routes } from "react-router-dom";

import ActivitiesPage from "@/pages/Activities";
import AuthenticationPage from "@/pages/Authentication";
import { BabyPage } from "@/pages/Baby";
import { EntriesPage } from "@/pages/Entries";
import { EntryPage } from "@/pages/Entry";
import { FamilyPage } from "@/pages/Family";
import { GraphicsPage } from "@/pages/Graphics";
import { HomePage } from "@/pages/Home";
import { PageId } from "@/enums/PageId";
import { SettingsPage } from "@/pages/Settings";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useMemo } from "react";

export function PrivateRoutes() {
  const { user } = useAuthentication();
  const babyId = useMemo(() => {
    return user?.babyId ?? "";
  }, [user]);
  return (
    <Routes>
      <>
        {isNullOrWhiteSpace(babyId) == true && (
          <>
            <Route path="*" element={<BabyPage />} />
          </>
        )}
        {isNullOrWhiteSpace(babyId) == false && (
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
              path={getPath({ page: PageId.EntryTypes })}
              element={<ActivitiesPage />}
            />
            <Route path={getPath({ page: PageId.Entry })}>
              <Route path="" element={<EntryPage />} />
              <Route path="*" element={<Navigate replace to="" />} />
              <Route path=":entryId" element={<EntryPage />} />
            </Route>
            <Route path={getPath({ page: PageId.Baby })}>
              <Route path="" element={<BabyPage />} />
              <Route path="*" element={<Navigate replace to="" />} />
              <Route path=":babyId" element={<BabyPage />} />
            </Route>
          </>
        )}
      </>
    </Routes>
  );
}
