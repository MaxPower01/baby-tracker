import { Navigate, Route, Routes } from "react-router-dom";

import { LandingPage } from "@/pages/Landing/LandingPage";
import { PageId } from "@/enums/PageId";
import getPath from "@/utils/getPath";

export function PublicRoutes() {
  return (
    <Routes>
      <Route
        path={getPath({ page: PageId.Landing })}
        element={<LandingPage />}
      />
      <Route
        path="*"
        element={<Navigate replace to={getPath({ page: PageId.Landing })} />}
      />
    </Routes>
  );
}
