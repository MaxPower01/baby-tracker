import MenuContext from "@/modules/menu/components/MenuContext";
import React from "react";

export default function MenuProvider(props: React.PropsWithChildren<{}>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  return (
    <MenuContext.Provider
      value={{
        menuProps: {
          anchorEl,
          open: Boolean(anchorEl),
          onClose: () => setAnchorEl(null),
        },
        setAnchorEl: (el: HTMLElement | null) => {
          setAnchorEl(el);
        },
      }}
    >
      {props.children}
    </MenuContext.Provider>
  );
}
