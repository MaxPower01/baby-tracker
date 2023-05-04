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
import CSSBreakpoint from "../../../common/enums/CSSBreakpoint";
import ActivityType from "../enums/ActivityType";
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
        <Container maxWidth={CSSBreakpoint.Small} disableGutters>
          <Toolbar>
            <Typography variant="h6">Ajouter une entrée</Typography>
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
