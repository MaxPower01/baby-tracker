import React, { createContext } from "react";

import ChildrenContextValue from "@/modules/children/types/ChildrenContextValue";

export default createContext(
  null
) as React.Context<ChildrenContextValue | null>;
