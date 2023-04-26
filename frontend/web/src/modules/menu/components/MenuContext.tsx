import { MenuProps } from "@mui/material/Menu";
import React from "react";

const MenuContext = React.createContext<{
  menuProps: MenuProps;
  setAnchorEl: (el: HTMLElement | null) => void;
}>({
  menuProps: {
    open: false,
    anchorEl: null,
    onClose: () => {},
  },
  setAnchorEl: () => {},
});

export default MenuContext;
