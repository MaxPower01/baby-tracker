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
  IconButton,
  Stack,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ActivityIcon from "@/pages/Activities/components/ActivityIcon";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import { PageId } from "@/enums/PageId";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import SortIcon from "@mui/icons-material/Sort";
import { functions } from "@/firebase";
import { getEntryTypeName } from "@/utils/getEntryTypeName";
import getPath from "@/utils/getPath";
import { httpsCallable } from "firebase/functions";
import isDevelopment from "@/utils/isDevelopment";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";
import { useNavigate } from "react-router-dom";

export function FiltersDrawer(props: { isOpen: boolean; onClose: () => void }) {
  const theme = useTheme();

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={props.isOpen}
        onOpen={() => {}}
        onClose={() => props.onClose()}
        disableSwipeToOpen={true}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "inherit",
            backgroundImage: "inherit",
          }}
        >
          <Container maxWidth={CSSBreakpoint.Small} disableGutters>
            <Toolbar>
              <Typography variant="h6">Filtres</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => props.onClose()}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
            <Divider
              sx={{
                marginLeft: 2,
                marginRight: 2,
              }}
            />
          </Container>
        </Box>
        <Container maxWidth={CSSBreakpoint.Small}>
          <Box
            sx={{
              maxHeight: "70vh",
            }}
          >
            <Stack
              sx={{
                paddingTop: 2,
                paddingBottom: 2,
              }}
            >
              <Typography variant="body1">Filtres</Typography>
            </Stack>
          </Box>
        </Container>
      </SwipeableDrawer>
    </>
  );
}
