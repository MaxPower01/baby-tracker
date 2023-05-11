import AuthenticationContextValue from "@/modules/authentication/types/AuthenticationContextValue";
import React, { createContext } from "react";

export default createContext(
  null
) as React.Context<AuthenticationContextValue | null>;
