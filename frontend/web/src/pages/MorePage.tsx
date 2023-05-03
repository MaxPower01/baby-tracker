import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { resetAppState } from "../app/state/appSlice";
import LoadingIndicator from "../common/components/LoadingIndicator";
import { exportToJSONFile } from "../lib/utils";
import useEntries from "../modules/entries/hooks/useEntries";
import {
  addEntries,
  resetEntriesState,
} from "../modules/entries/state/entriesSlice";
import { useAppDispatch } from "../modules/store/hooks/useAppDispatch";

export default function MorePage() {
  // const { Menu, openMenu, closeMenu } = useMenu();
  const dispatch = useAppDispatch();
  const { entries, isLoading: isLoadingEntries } = useEntries();

  const [successSnackbarMessage, setSuccessSnackbarMessage] = useState("");
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const handleReset = () => {
    dispatch(resetEntriesState());
    dispatch(resetAppState());
  };

  const handleExport = useCallback(() => {
    if (isLoadingEntries || !entries) {
      return;
    }
    const data = {
      entries: entries.map((entry) => entry.serialize()),
    };
    exportToJSONFile(data);
  }, [entries, isLoadingEntries]);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (typeof data === "string") {
        const parsedData = JSON.parse(data);
        const entries = parsedData.entries;
        if (entries) {
          dispatch(
            addEntries({
              entries: entries,
              overwrite: true,
            })
          );
          setSuccessSnackbarMessage("Données importées avec succès");
          setSuccessSnackbarOpen(true);
        }
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <>
      <Stack spacing={2} justifyContent="center" alignItems="center">
        {/* <Button onClick={openMenu} variant="contained">
        Exemple de menu
      </Button>

      <Menu>
        <MenuItem onClick={closeMenu}>Item A</MenuItem>
        <MenuItem onClick={closeMenu}>Item B</MenuItem>
      </Menu> */}

        <input
          id="import-data"
          aria-label="Importer des données"
          type="file"
          onChange={handleImport}
          style={{ display: "none" }}
        />

        <Button
          onClick={() => {
            const input = document.getElementById(
              "import-data"
            ) as HTMLInputElement;
            input.click();
          }}
          variant="contained"
          color="primary"
        >
          Importer des données
        </Button>

        <Button
          onClick={handleExport}
          variant="contained"
          color="primary"
          disabled={isLoadingEntries}
        >
          {isLoadingEntries ? <LoadingIndicator /> : "Exporter les données"}
        </Button>

        <Button onClick={handleReset} variant="contained" color="error">
          Réinitialiser l'application
        </Button>
      </Stack>

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {successSnackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
