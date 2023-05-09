import CustomUser from "@/modules/authentication/models/CustomUser";
import React from "react";

export default React.createContext(null) as React.Context<{
  user: CustomUser | null;
} | null>;
