<<<<<<< HEAD
import { AccessRequirement } from "@/enums/AccessRequirement";
=======
>>>>>>> 2096f89b9f78a09f0393134a83667e6e604bbaf3
import CustomUser from "@/types/CustomUser";
import { Navigate } from "react-router-dom";
import { PageId } from "@/enums/PageId";
import React from "react";
import getPath from "@/utils/getPath";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";

type Props = React.PropsWithChildren<{
<<<<<<< HEAD
  requirement?: AccessRequirement;
  redirect?: string;
}>;

export function ProtectedRoute({
  children,
  requirement,
  redirect = "/",
}: Props) {
  const { user } = useAuthentication();

  // If there's no requirement, just return the children
  if (requirement == null) {
    return children;
  }

  // User is not logged in, but authentication is required
  if (requirement == AccessRequirement.Authenticated && !user) {
    if (redirect != null) {
      return <Navigate replace to={redirect} />;
    } else {
      return <Navigate replace to={getPath({ page: PageId.Landing })} />;
    }
  }

  // User doesn't have a baby selected, but one is required
  if (
    requirement == AccessRequirement.BabySelected &&
    (!user || !user.babyId)
  ) {
    if (redirect != null) {
      return <Navigate replace to={redirect} />;
    } else {
      return <Navigate replace to={getPath({ page: PageId.Landing })} />;
    }
  }

  if (requirement == AccessRequirement.NoBabySelected && user?.babyId) {
    if (redirect != null) {
      return <Navigate replace to={redirect} />;
    } else {
      return <Navigate replace to={getPath({ page: PageId.Home })} />;
    }
  }

  // No requirements failed, return the children
  return children;
=======
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
>>>>>>> 2096f89b9f78a09f0393134a83667e6e604bbaf3
}
