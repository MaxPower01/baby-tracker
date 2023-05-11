import React, { createContext } from "react";
import AuthenticationContextValue from "../types/AuthenticationContextValue";

export default createContext(
  null
) as React.Context<AuthenticationContextValue | null>;
