import PageName from "@/common/enums/PageName";
import { getPath } from "@/lib/utils";
import AuthenticationPage from "@/pages/AuthenticationPage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="" element={<AuthenticationPage />} />
      <Route path="*" element={<Navigate replace to="" />} />
      <Route
        path={getPath({ page: PageName.Authentication })}
        element={<AuthenticationPage />}
      />
    </Routes>
  );
}
