import { Avatar, Button, Stack, Typography } from "@mui/material";
import { auth, db } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { exportToJSONFile, isNullOrWhiteSpace } from "@/utils/utils";
import {
  resetEntriesState,
  selectEntries,
} from "@/modules/entries/state/entriesSlice";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EntryModel from "@/modules/entries/models/EntryModel";
import PageId from "@/common/enums/PageId";
import getPath from "@/utils/getPath";
import { resetAppState } from "@/app/state/appSlice";
import { useAppDispatch } from "@/modules/store/hooks/useAppDispatch";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import { useCallback } from "react";
import useEntries from "@/modules/entries/hooks/useEntries";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MenuPage() {
  // const { Menu, openMenu, closeMenu } = useMenu();
  const { entries, isLoading: isLoadingEntries } = useEntries();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const selectedChild = user?.selectedChild ?? "";
  const localEntries = useSelector(selectEntries);

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
    if (!user || !localEntries?.length || isNullOrWhiteSpace(selectedChild)) {
      return;
    }
    const batch = writeBatch(db);
    for (let i = 0; i < localEntries.length; i++) {
      const entry = localEntries[i];
      if (entry.id != null) {
        const entryRef = doc(
          db,
          `children/${selectedChild}/entries/${entry.id}`
        );
        entry.setEndDate();
        batch.set(entryRef, entry.toJSON({ keepDates: true }));
      }
    }
    batch.commit().then(() => {});
  }, [user]);

  const handleDownloadAllEntries = useCallback(async () => {
    if (!user || isNullOrWhiteSpace(selectedChild)) {
      return;
    }
    const q = query(
      collection(db, `children/${selectedChild}/entries`),
      orderBy("startDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    const entries: EntryModel[] = [];
    querySnapshot.forEach((doc) => {
      const entry = EntryModel.fromJSON(doc.data());
      entry.id = doc.id;
      entries.push(entry);
    });
    const data = {
      entries: entries.map((entry) => entry.serialize()),
    };
    exportToJSONFile(data);
  }, [user, selectedChild]);

  // const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) {
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     const data = event.target?.result;
  //     if (typeof data === "string") {
  //       const parsedData = JSON.parse(data);
  //       const entries = parsedData.entries;
  //       if (entries) {
  //         dispatch(
  //           addEntries({
  //             entries: entries,
  //             overwrite: true,
  //           })
  //         );
  //         setSuccessSnackbarMessage("Données importées avec succès");
  //         setSuccessSnackbarOpen(true);
  //       }
  //     }
  //   };
  //   reader.readAsText(file);
  //   event.target.value = "";
  // };

  const handleSignOutButtonClick = () => {
    auth.signOut().then(() => {
      navigate(getPath({ page: PageId.Home }));
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
                  navigate(getPath({ page: PageId.Authentication }))
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

        {/* <Stack spacing={2} alignItems="center">
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

          <Button
            onClick={handleDownloadAllEntries}
            variant="contained"
            color="primary"
          >
            Télécharger toutes les donées depuis le cloud
          </Button>
        </Stack> */}

        {/* <Button onClick={handleReset} variant="contained" color="error">
          Supprimer les données locales
        </Button> */}
      </Stack>
    </>
  );
}
