import React from "react";
import { SnackbarContextProps } from "./types/SnackbarContextProps";
import { SnackbarProps } from "@mui/material";

export const SnackbarContext = React.createContext<
  SnackbarContextProps | undefined
>(undefined);
