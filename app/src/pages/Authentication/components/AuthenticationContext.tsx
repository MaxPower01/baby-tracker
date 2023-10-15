import AuthenticationContextValue from "@/pages/Authentication/types/AuthenticationContextValue";
import React, { createContext } from "react";

export default createContext(
  null
) as React.Context<AuthenticationContextValue | null>;
