import {
  Avatar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PageId from "@/common/enums/PageId";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import SortIcon from "@mui/icons-material/Sort";
import { functions } from "@/firebase";
import getPath from "@/utils/getPath";
import { httpsCallable } from "firebase/functions";
import { isNullOrWhiteSpace } from "@/utils/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import useChildren from "@/modules/children/hooks/useChildren";
import { useNavigate } from "react-router-dom";

export default function MenuDrawer(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const addParentFunction = httpsCallable(functions, "addParent");
  const navigate = useNavigate();
  const { user, signOut } = useAuthentication();
  const { children } = useChildren();
  const theme = useTheme();
  const [dialogOpened, setDialogOpened] = useState(false);
  const handleDialogClose = () => setDialogOpened(false);
  const [email, setEmail] = useState("");

  const selectedChild = useMemo(() => {
    return user?.selectedChild ?? "";
  }, [user, children]);

  const selectedChildName = useMemo(() => {
    if (children == null || isNullOrWhiteSpace(selectedChild)) return "";
    return children.find((child) => child.id === selectedChild)?.name ?? "";
  }, [selectedChild, children]);

  const handleAddParent = useCallback(() => {
    if (
      user == null ||
      isNullOrWhiteSpace(selectedChild) ||
      isNullOrWhiteSpace(email)
    ) {
      handleDialogClose();
      return;
    }
    addParentFunction({
      childId: selectedChild,
      parentEmail: email,
    })
      .then((result: any) => {
        // Access code successfully generated and returned
        const accessCode = result.data.accessCode;
        console.log("Access code:", accessCode);
      })
      .catch((error: any) => {
        // Error occurred during function execution
        const errorCode = error?.code;
        const errorMessage = error?.message;
        console.error("Error:", errorCode, errorMessage);
      });
    handleDialogClose();
  }, [selectedChild, user, addParentFunction, email]);

  const avatarWidth = 100;
  const avatarFontSize = avatarWidth / 2.5;

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={props.isOpen}
        onOpen={() => {}}
        onClose={() => props.onClose()}
        disableSwipeToOpen={true}
      >
        <Container maxWidth={CSSBreakpoint.Small}>
          <Stack
            spacing={4}
            sx={{
              paddingTop: 2,
              paddingBottom: 2,
            }}
          >
            <Stack
              spacing={2}
              sx={{
                width: "100%",
              }}
              alignItems="center"
            >
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
                  <Avatar
                    sx={{
                      width: avatarWidth,
                      height: avatarWidth,
                      fontSize: avatarFontSize,
                    }}
                    src={user?.photoURL ?? undefined}
                  >
                    {user.displayName
                      ?.split(" ")
                      .map((name) => name[0].toUpperCase())}
                  </Avatar>
                  <Typography variant="h5" textAlign={"center"}>
                    {user.displayName}
                  </Typography>
                </>
              )}
            </Stack>
            <Divider />
            <Stack
              sx={{
                width: "100%",
              }}
              alignItems={"flex-start"}
              spacing={1}
            >
              <Button
                variant="text"
                fullWidth
                sx={{
                  color: theme.customPalette.text.primary,
                  textAlign: "left",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  props.onClose();
                  navigate(getPath({ page: PageId.Family }));
                }}
              >
                <PeopleAltIcon
                  sx={{
                    marginRight: 1,
                  }}
                />
                <Typography variant="body1">Ma famille</Typography>
              </Button>
              {!isNullOrWhiteSpace(selectedChild) && (
                <Button
                  variant="text"
                  fullWidth
                  sx={{
                    color: theme.customPalette.text.primary,
                    textAlign: "left",
                    justifyContent: "flex-start",
                  }}
                  onClick={() => {
                    props.onClose();
                    setEmail("");
                    setDialogOpened(true);
                  }}
                >
                  <PersonAddIcon
                    sx={{
                      marginRight: 1,
                    }}
                  />
                  <Typography variant="body1">Inviter quelqu'un</Typography>
                </Button>
              )}
              <Button
                variant="text"
                fullWidth
                sx={{
                  color: theme.customPalette.text.primary,
                  textAlign: "left",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  props.onClose();
                  navigate(getPath({ page: PageId.Activities }));
                }}
              >
                <SortIcon
                  sx={{
                    marginRight: 1,
                  }}
                />
                <Typography variant="body1">
                  Modifier l'ordre des activités
                </Typography>
              </Button>
              <Button
                variant="text"
                fullWidth
                sx={{
                  color: theme.customPalette.text.primary,
                  textAlign: "left",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  props.onClose();
                  navigate(getPath({ page: PageId.Settings }));
                }}
              >
                <SettingsIcon
                  sx={{
                    marginRight: 1,
                  }}
                />
                <Typography variant="body1">Paramètres</Typography>
              </Button>
            </Stack>
            <Divider />
            <Stack
              sx={{
                width: "100%",
              }}
              alignItems={"flex-start"}
              spacing={1}
            >
              <Button
                variant="text"
                fullWidth
                sx={{
                  color: theme.customPalette.text.primary,
                  textAlign: "left",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  props.onClose();
                  signOut();
                }}
              >
                <ExitToAppIcon
                  sx={{
                    marginRight: 1,
                  }}
                />
                <Typography variant="body1">Déconnexion</Typography>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </SwipeableDrawer>

      <Dialog
        open={dialogOpened}
        onClose={handleDialogClose}
        aria-labelledby="add-parent-dialog-title"
        aria-describedby="add-parent-dialog-description"
      >
        <DialogTitle id="add-parent-dialog-title">
          Ajouter un parent
          {!isNullOrWhiteSpace(selectedChild) && " pour " + selectedChildName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="add-parent-dialog-description">
            Entrez l'adresse email du parent à ajouter. Il pourra ensuite
            accéder aux données de l'enfant et ajouter des entrées.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email du parent"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddParent}>Ajouter un parent</Button>
          <Button onClick={handleDialogClose}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
