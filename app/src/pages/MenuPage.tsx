import { auth, db } from "@/firebase";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useEntries from "@/modules/entries/hooks/useEntries";
import {
  addEntries,
  resetEntriesState,
  selectEntries,
} from "@/modules/entries/state/entriesSlice";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Alert,
  Avatar,
  Button,
  Slide,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { doc, writeBatch } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAppState } from "../app/state/appSlice";
import LoadingIndicator from "../common/components/LoadingIndicator";
import PageName from "../common/enums/PageName";
import { exportToJSONFile, getPath } from "../lib/utils";

export default function MenuPage() {
  // const { Menu, openMenu, closeMenu } = useMenu();
  const dispatch = useAppDispatch();
  const { entries, isLoading: isLoadingEntries } = useEntries();
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const localEntries = useSelector(selectEntries);

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

  const handleSaveLocalDataToCloud = useCallback(() => {
    if (!user || !localEntries?.length) {
      return;
    }
    const batch = writeBatch(db);
    for (let i = 0; i < localEntries.length; i++) {
      const entry = localEntries[i];
      if (entry.id != null) {
        const entryRef = doc(
          db,
          `children/${user.selectedChild}/entries/${entry.id}`
        );
        batch.set(entryRef, entry.toJSON());
      }
    }
    batch.commit().then(() => {});
  }, [user]);

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

  const handleSignOutButtonClick = () => {
    auth.signOut().then(() => {
      navigate(getPath({ page: PageName.Home }));
    });
  };

  return (
    <>
      <Stack spacing={4} alignItems="center">
        {/* <Button onClick={openMenu} variant="contained">
        Exemple de menu
      </Button>

      <Menu>
        <MenuItem onClick={closeMenu}>Item A</MenuItem>
        <MenuItem onClick={closeMenu}>Item B</MenuItem>
      </Menu> */}
        <Stack spacing={2} alignItems="center">
          {user == null ? (
            <>
              <Stack spacing={1} alignItems="center">
                <AccountCircleIcon
                  sx={{
                    fontSize: "6em",
                  }}
                />
                <Typography variant="body1" textAlign={"center"}>
                  Connectez-vous pour sauvegarder vos données
                </Typography>
              </Stack>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(getPath({ page: PageName.Authentication }))
                }
              >
                Se connecter
              </Button>
            </>
          ) : (
            <>
              <Avatar>
                {user.displayName
                  ?.split(" ")
                  .map((name) => name[0].toUpperCase())}
              </Avatar>
              <Typography variant="h5" textAlign={"center"}>
                {user.displayName}
              </Typography>
              <Button
                variant="outlined"
                onClick={(e) => handleSignOutButtonClick()}
                fullWidth
              >
                Se déconnecter
              </Button>
            </>
          )}
        </Stack>

        <Stack spacing={2} alignItems="center">
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
            variant={isLoadingEntries ? "text" : "contained"}
            color="primary"
            disabled={isLoadingEntries}
          >
            {isLoadingEntries ? <LoadingIndicator /> : "Exporter les données"}
          </Button>

          <Button
            onClick={handleSaveLocalDataToCloud}
            variant="contained"
            color="primary"
          >
            Sauvegarder les données locales en ligne
          </Button>
        </Stack>

        <Button onClick={handleReset} variant="contained" color="error">
          Supprimer les données locales
        </Button>
      </Stack>

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionProps={{ dir: "up" }}
        TransitionComponent={Slide}
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
