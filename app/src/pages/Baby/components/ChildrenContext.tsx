import React, { createContext } from "react";

import ChildrenContextValue from "@/pages/Baby/types/ChildrenContextValue";

export default createContext(
  null
) as React.Context<ChildrenContextValue | null>;
