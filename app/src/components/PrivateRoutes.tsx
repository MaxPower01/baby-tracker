import { Navigate, Route, Routes } from "react-router-dom";

import ActivitiesPage from "@/pages/Activities/ActivitiesPage";
import AuthenticationPage from "@/pages/Authentication";
import { BabyPage } from "@/pages/Baby/BabyPage";
import { ChartsPage } from "@/pages/Charts/ChartsPage";
import { EntryPage } from "@/pages/Entry/EntryPage";
import { FamilyPage } from "@/pages/Family/FamilyPage";
import { HistoryPage } from "@/pages/History/HistoryPage";
import { HomePage } from "@/pages/Home/HomePage";
import { PageId } from "@/enums/PageId";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
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
              element={<ChartsPage />}
            />
            <Route
              path={getPath({ page: PageId.History })}
              element={<HistoryPage />}
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
              <Route path=":dateKey/:entryId" element={<EntryPage />} />
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
