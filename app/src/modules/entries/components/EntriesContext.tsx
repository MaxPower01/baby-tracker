import EntriesContextValue from "@/modules/entries/types/EntriesContextValue";
import React, { createContext } from "react";

export default createContext(null) as React.Context<EntriesContextValue | null>;
