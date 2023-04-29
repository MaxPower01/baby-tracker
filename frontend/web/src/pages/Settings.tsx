import { Button, MenuItem } from "@mui/material";
import useMenu from "../modules/menu/hooks/useMenu";

export default function Settings() {
  const { Menu, openMenu, closeMenu } = useMenu();

  return (
    <>
      <Button onClick={openMenu} variant="contained">
        Exemple de menu
      </Button>

      <Menu>
        <MenuItem onClick={closeMenu}>Item A</MenuItem>
        <MenuItem onClick={closeMenu}>Item B</MenuItem>
      </Menu>
    </>
  );
}
