import AuthenticationContext from "@/pages/Authentication/components/AuthenticationContext";
import { useContext } from "react";

export function useAuthentication() {
  const authentication = useContext(AuthenticationContext);
  if (authentication == null) {
    throw new Error(
      "Authentication context is null. Make sure to call useAuthentication() inside of a <AuthenticationProvider />"
    );
  }
  return authentication;
}
