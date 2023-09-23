import { Navigate, Route, Routes } from "react-router-dom";

import AuthenticationPage from "@/pages/Authentication";
import PageId from "@/enums/PageId";
import getPath from "@/utils/getPath";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="" element={<AuthenticationPage />} />
      <Route path="*" element={<Navigate replace to="" />} />
      <Route
        path={getPath({ page: PageId.Authentication })}
        element={<AuthenticationPage />}
      />
    </Routes>
  );
}
