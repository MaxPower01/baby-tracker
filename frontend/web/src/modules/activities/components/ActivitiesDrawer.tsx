import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Container,
  Divider,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { ActivityType, CSSBreakpoint } from "../../../lib/enums";
import ActivityButtons from "./ActivityButtons";

export default function ActivitiesDrawer(props: {
  isOpen: boolean;
  onClose: () => void;
  handleActivityClick: (type: ActivityType) => void;
}) {
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
        <Container maxWidth={CSSBreakpoint.Medium}>
          <Toolbar disableGutters>
            <Typography variant="h6">Ajouter une entrée</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={() => props.onClose()}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </Container>
        <Divider />
      </Box>
      <Box
        sx={{
          maxHeight: "70vh",
        }}
      >
        <ActivityButtons
          onClick={(type: ActivityType) => {
            props.handleActivityClick(type);
            props.onClose();
          }}
        />
      </Box>
    </SwipeableDrawer>
  );
}
