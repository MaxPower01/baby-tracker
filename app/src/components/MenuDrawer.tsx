import {
  Avatar,
  Box,
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

import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PageId } from "@/enums/PageId";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import SortIcon from "@mui/icons-material/Sort";
import { functions } from "@/firebase";
import { getMockEntries } from "@/utils/getMockEntries";
import getPath from "@/utils/getPath";
import { httpsCallable } from "firebase/functions";
import isDevelopment from "@/utils/isDevelopment";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";
import { useEntries } from "@/components/Entries/EntriesProvider";
import { useNavigate } from "react-router-dom";

export function MenuDrawer(props: { isOpen: boolean; onClose: () => void }) {
  const addParentFunction = httpsCallable(functions, "addParent");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, signOut } = useAuthentication();
  const theme = useTheme();
  const [dialogOpened, setDialogOpened] = useState(false);
  const handleDialogClose = () => setDialogOpened(false);
  const [email, setEmail] = useState("");
  const { saveEntries } = useEntries();
  const [postingMockEntries, setPostingMockEntries] = useState(false);

  const babyId = useMemo(() => {
    return user?.babyId ?? "";
  }, [user?.babyId]);

  const baby = user?.baby;

  const handleAddParent = useCallback(() => {
    if (
      user == null ||
      isNullOrWhiteSpace(babyId) ||
      isNullOrWhiteSpace(email)
    ) {
      handleDialogClose();
      return;
    }
    addParentFunction({
      babyId: babyId,
      parentEmail: email,
    })
      .then((result: any) => {
        // Access code successfully generated and returned
        const accessCode = result.data.accessCode;
      })
      .catch((error: any) => {
        // Error occurred during function execution
        const errorCode = error?.code;
        const errorMessage = error?.message;
        console.error("Error:", errorCode, errorMessage);
      });
    handleDialogClose();
  }, [babyId, user, addParentFunction, email]);

  const handlePostMockEntriesButtonClick = useCallback(async () => {
    try {
      if (postingMockEntries || user == null) {
        return;
      }
      setPostingMockEntries(true);
      const untilDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(untilDate.getDate() - 90);
      const entries = getMockEntries({
        fromDate,
        untilDate,
        babyId,
      });
      if (!entries || entries.length === 0) {
        setPostingMockEntries(false);
        return;
      }
      await saveEntries(entries);
      setPostingMockEntries(false);
    } catch (error) {
      console.error(error);
      setPostingMockEntries(false);
    }
  }, [postingMockEntries, babyId]);

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
            spacing={2}
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
                  {/* <Stack spacing={1} alignItems="center">
                    <AccountCircleIcon
                      sx={{
                        fontSize: "6em",
                      }}
                    />
                    <Typography
                      variant="body1"
                      textAlign={"center"}
                      sx={{
                        color: theme.customPalette.text.secondary,
                      }}
                    >
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
                  </Button> */}
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
                  <Typography
                    variant="h5"
                    textAlign={"center"}
                    sx={{
                      color: theme.customPalette.text.primary,
                    }}
                  >
                    {user.displayName}
                  </Typography>
                </>
              )}
            </Stack>

            {isNullOrWhiteSpace(babyId) == false && (
              <>
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
                  {!isNullOrWhiteSpace(babyId) && (
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
              </>
            )}

            {isNullOrWhiteSpace(babyId) == false && isDevelopment() && (
              <>
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
                    disabled={postingMockEntries}
                    onClick={() => handlePostMockEntriesButtonClick()}
                  >
                    <FileUploadIcon
                      sx={{
                        marginRight: 1,
                      }}
                    />
                    <Typography variant="body1">
                      Générer des fausses entrées
                    </Typography>
                    <Box
                      sx={{
                        display: postingMockEntries ? "flex" : "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LoadingIndicator
                        size={`calc(${theme.typography.button.fontSize} * 2)`}
                      />
                    </Box>
                  </Button>
                </Stack>
              </>
            )}

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
          {!isNullOrWhiteSpace(babyId) && " pour " + baby?.name}
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
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button onClick={handleAddParent}>Ajouter un parent</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
