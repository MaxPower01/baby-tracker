import CustomUser from "@/types/CustomUser";
import { Navigate } from "react-router-dom";
import { PageId } from "@/enums/PageId";
import React from "react";
import getPath from "@/utils/getPath";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";

type Props = React.PropsWithChildren<{
  user: CustomUser | null;
  requireAuth?: boolean;
  requireBaby?: boolean;
  redirect?: string;
}>;

export function ProtectedRoute(props: Props) {
  if (props.requireAuth && !props.user) {
    // User is not logged in
    return <Navigate replace to={getPath({ page: PageId.Landing })} />;
  }

  if (props.requireBaby && (!props.user || !props.user.babyId)) {
    // User is logged in but does not have a baby selected
    return <Navigate replace to={getPath({ page: PageId.Landing })} />;
  }

  return props.children;
}
