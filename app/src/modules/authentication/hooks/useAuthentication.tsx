import { useContext } from "react";
import AuthenticationContext from "../components/AuthenticationContext";

export default function useAuthentication() {
  const authentication = useContext(AuthenticationContext);
  if (authentication == null) {
    throw new Error(
      "Authentication context is null. Make sure to call useAuthentication() inside of a <AuthenticationProvider />"
    );
  }
  return authentication;
}
