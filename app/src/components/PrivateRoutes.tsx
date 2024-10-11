import { Navigate, Route, Routes } from "react-router-dom";

import ActivitiesPage from "@/pages/Activities/ActivitiesPage";
import { AuthenticationPage } from "@/pages/Authentication/AuthenticationPage";
import { BabyPage } from "@/pages/Baby/BabyPage";
import { ChartsPage } from "@/pages/Charts/ChartsPage";
import { EntryPage } from "@/pages/Entry/EntryPage";
import { FamilyPage } from "@/pages/Family/FamilyPage";
import { HistoryPage } from "@/pages/History/HistoryPage";
import { HomePage } from "@/pages/Home/HomePage";
import { LandingPage } from "@/pages/Landing/LandingPage";
import { NewBabyPage } from "@/pages/NewBaby/NewBabyPage";
import { PageId } from "@/enums/PageId";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/components/AuthenticationProvider";

export function PrivateRoutes() {
  const { user } = useAuthentication();

  return (
    <Routes>
      <>
        {isNullOrWhiteSpace(user?.babyId) == true && (
          <>
            <Route
              path={getPath({ page: PageId.Landing })}
              element={<LandingPage />}
            />

            <Route
              path="*"
              element={
                <Navigate replace to={getPath({ page: PageId.Landing })} />
              }
            />

            <Route
              path={getPath({ page: PageId.NewBaby })}
              element={<NewBabyPage />}
            />
          </>
        )}

        {isNullOrWhiteSpace(user?.babyId) == false && (
          <>
            <Route
              path={getPath({ page: PageId.Home })}
              element={<HomePage />}
            />

            <Route
              path="*"
              element={<Navigate replace to={getPath({ page: PageId.Home })} />}
            />

            <Route
              path={getPath({ page: PageId.Family })}
              element={<FamilyPage />}
            />

            <Route
              path={getPath({ page: PageId.Charts })}
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

            <Route
              path={getPath({ page: PageId.NewBaby })}
              element={<NewBabyPage />}
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
