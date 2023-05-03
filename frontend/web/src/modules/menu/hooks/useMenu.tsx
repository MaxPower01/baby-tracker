import { Menu as MuiMenu } from "@mui/material";
import { MenuProps } from "@mui/material/Menu";
import React from "react";
import MenuContext from "../components/MenuContext";

// Wrapping the Menu component in a hook allows us to use the context.
// The goal is to bind some props to the context instead of the props of the component.
const Menu: React.FC<Omit<MenuProps, "open" | "anchorEl" | "onClose">> = (
  props
) => {
  // Retrieve the context.
  const { menuProps } = React.useContext(MenuContext);
  // Spread the props to the Menu component.
  return <MuiMenu {...menuProps} {...props} />;
};

export default function useMenu() {
  const menuContext = React.useContext(MenuContext);
  if (!menuContext) {
    throw new Error(
      "No MenuContext provided. Make sure to call useMenu() inside a MenuProvider."
    );
  }

  const { setAnchorEl } = menuContext;

  const openMenu = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      const target = event.currentTarget;
      setAnchorEl(target);
    },
    [setAnchorEl]
  );

  const closeMenu = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(null);
    },
    [setAnchorEl]
  );

  return {
    Menu,
    openMenu,
    closeMenu,
  };
}