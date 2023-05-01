import { Button, MenuItem, Stack } from "@mui/material";
import { resetAppState } from "../app/state/appSlice";
import { resetEntriesState } from "../modules/entries/state/entriesSlice";
import useMenu from "../modules/menu/hooks/useMenu";
import { useAppDispatch } from "../modules/store/hooks/useAppDispatch";

export default function SettingsPage() {
  const { Menu, openMenu, closeMenu } = useMenu();
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetEntriesState());
    dispatch(resetAppState());
  };

  return (
    <Stack spacing={2} justifyContent="center" alignItems="center">
      <Button onClick={openMenu} variant="contained">
        Exemple de menu
      </Button>

      <Menu>
        <MenuItem onClick={closeMenu}>Item A</MenuItem>
        <MenuItem onClick={closeMenu}>Item B</MenuItem>
      </Menu>

      <Button onClick={handleReset} variant="contained" color="error">
        Réinitialiser l'application
      </Button>
    </Stack>
  );
}
