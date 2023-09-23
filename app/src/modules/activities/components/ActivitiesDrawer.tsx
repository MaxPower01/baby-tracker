import {
  Box,
  Container,
  Divider,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";

import ActivityButtons from "@/modules/activities/components/ActivityButtons";
import ActivityType from "@/modules/activities/enums/ActivityType";
import CSSBreakpoint from "@/enums/CSSBreakpoint";
import CloseIcon from "@mui/icons-material/Close";
import PageId from "@/enums/PageId";
import SettingsIcon from "@mui/icons-material/Settings";
import getPath from "@/utils/getPath";
import { useNavigate } from "react-router-dom";

export default function ActivitiesDrawer(props: {
  isOpen: boolean;
  onClose: () => void;
  handleActivityClick: (type: ActivityType) => void;
}) {
  const navigate = useNavigate();
  return (
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
            <Typography variant="h6">Ajouter une entrée</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              onClick={() => {
                navigate(getPath({ page: PageId.Activities }));
                props.onClose();
              }}
            >
              <SettingsIcon />
            </IconButton>
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
      <Container maxWidth={CSSBreakpoint.Small} disableGutters>
        <Box
          sx={{
            maxHeight: "70vh",
            "& .ActivityIcon": {
              fontSize: "4em",
            },
          }}
        >
          <ActivityButtons
            onClick={(type: ActivityType) => {
              props.handleActivityClick(type);
              props.onClose();
            }}
          />
        </Box>
      </Container>
    </SwipeableDrawer>
  );
}
