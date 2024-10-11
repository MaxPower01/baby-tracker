import { Container, useTheme } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { AccessRequirement } from "@/enums/AccessRequirement";
import ActivitiesPage from "@/pages/Activities/ActivitiesPage";
import { BabyPage } from "@/pages/Baby/BabyPage";
import { BottomBar } from "@/components/BottomBar";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { ChartsPage } from "@/pages/Charts/ChartsPage";
import { EntryPage } from "@/pages/Entry/EntryPage";
import { FamilyPage } from "@/pages/Family/FamilyPage";
import { HistoryPage } from "@/pages/History/HistoryPage";
import { HomePage } from "@/pages/Home/HomePage";
import { LandingPage } from "@/pages/Landing/LandingPage";
import { LoadingPage } from "@/pages/Loading/LoadingPage";
import { MenuProvider } from "@/components/MenuProvider";
import { NewBabyPage } from "@/pages/NewBaby/NewBabyPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";
import { PageId } from "@/enums/PageId";
import { PrivateRoutes } from "@/components/PrivateRoutes";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoutes } from "@/components/PublicRoutes";
import { SettingsPage } from "@/pages/Settings/SettingsPage";
import { TopBar } from "@/components/TopBar";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { topbarContainerId } from "@/utils/constants";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";

// let didInit = false;

export function App() {
  const { user, isLoading } = useAuthentication();

  // useEffect(() => {
  //   if (!didInit) {
  //     didInit = true;
  //     // Code here will run only once per app load
  //   }
  // }, []);

  return (
    <>
      <Routes>
        {isLoading == true ? (
          <>
            <Route path="*" element={<LoadingPage />} />
          </>
        ) : (
          <>
            <Route
              path={getPath({ page: PageId.Landing })}
              element={
                <ProtectedRoute
                  requirement={AccessRequirement.NoBabySelected}
                  redirect={getPath({ page: PageId.Home })}
                >
                  <LandingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={getPath({ page: PageId.NewBaby })}
              element={
                <ProtectedRoute requirement={AccessRequirement.Authenticated}>
                  <NewBabyPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={getPath({ page: PageId.Home })}
              element={
                <ProtectedRoute
                  requirement={AccessRequirement.BabySelected}
                  redirect={getPath({ page: PageId.Landing })}
                >
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path={getPath({ page: PageId.Family })}
              element={
                <ProtectedRoute requirement={AccessRequirement.BabySelected}>
                  <FamilyPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={getPath({ page: PageId.Charts })}
              element={
                <ProtectedRoute requirement={AccessRequirement.BabySelected}>
                  <ChartsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={getPath({ page: PageId.History })}
              element={
                <ProtectedRoute requirement={AccessRequirement.BabySelected}>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={getPath({ page: PageId.Settings })}
              element={
                <ProtectedRoute requirement={AccessRequirement.BabySelected}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path={getPath({ page: PageId.Activities })}
              element={
                <ProtectedRoute requirement={AccessRequirement.BabySelected}>
                  <ActivitiesPage />
                </ProtectedRoute>
              }
            />

            <Route path={getPath({ page: PageId.Entry })}>
              <Route path="" element={<EntryPage />} />
              <Route path=":dateKey/:entryId" element={<EntryPage />} />
              <Route path="*" element={<Navigate replace to="" />} />
            </Route>

            <Route path={getPath({ page: PageId.Baby })}>
              <Route
                path=":babyId"
                element={
                  <ProtectedRoute requirement={AccessRequirement.BabySelected}>
                    <BabyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <Navigate replace to={getPath({ page: PageId.NewBaby })} />
                }
              />
            </Route>

            <Route
              path=""
              element={
                user == null || user.babyId == null ? (
                  <Navigate replace to={getPath({ page: PageId.Landing })} />
                ) : (
                  <Navigate replace to={getPath({ page: PageId.Home })} />
                )
              }
            />

            <Route
              path="*"
              element={
                user == null ? (
                  <Navigate replace to={getPath({ page: PageId.Landing })} />
                ) : (
                  <NotFoundPage />
                )
              }
            />
          </>
        )}
      </Routes>

      {/* {user == null ? <PublicRoutes /> : <PrivateRoutes />} */}
    </>
  );
}
