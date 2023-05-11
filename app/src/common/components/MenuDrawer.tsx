import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import { getPath } from "@/lib/utils";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Avatar,
  Button,
  Container,
  Divider,
  Stack,
  SwipeableDrawer,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageName from "../enums/PageName";

export default function MenuDrawer(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { user, signOut } = useAuthentication();
  const theme = useTheme();

  return (
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
              </>
            )}
          </Stack>
          <Divider />
          <Stack
            sx={{
              width: "100%",
            }}
            alignItems={"flex-start"}
          >
            <Button
              variant="text"
              fullWidth
              sx={{
                color: theme.palette.text.primary,
                textAlign: "left",
                justifyContent: "flex-start",
              }}
              onClick={() => {
                props.onClose();
                navigate(getPath({ page: PageName.Children }));
              }}
            >
              <ChildCareIcon
                sx={{
                  marginRight: 1,
                }}
              />
              <Typography variant="body1">Enfants</Typography>
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{
                color: theme.palette.text.primary,
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
  );
}
