import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Fab,
  IconButton as MuiIconButton,
  Stack,
  SwipeableDrawer,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActivityType, CSSBreakpoint, PageName } from "../../lib/enums";
import { getPageName, getPageTitle, getPath } from "../../lib/utils";
import ActivityButtons from "../../modules/activities/components/ActivityButtons";

const FloatingActionButton = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

const IconButton = styled(MuiIconButton)({
  fontSize: "110%",
});

const InvisibleIconButton = styled(IconButton)({
  opacity: 0,
  pointerEvents: "none",
});

type BottomBarItem = {
  id: string;
  label?: string;
  onClick: React.EventHandler<React.MouseEvent>;
  IconWrapper: React.ElementType;
  Icon?: React.ElementType;
  color: "primary" | "inherit" | "secondary" | "default" | undefined;
  isFloatingActionButton?: boolean;
};

type Props = {
  component: React.ElementType<any> | undefined;
};

export default function BottomBar(props: Props) {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { pageName, pageTitle } = useMemo(() => {
    return {
      pageName: getPageName(pathname),
      pageTitle: getPageTitle(pathname),
    };
  }, [location.pathname]);

  const [activitiesDrawerIsOpen, setActivitiesDrawerIsOpen] = useState(false);

  const openActivitiesDrawer = () => {
    setActivitiesDrawerIsOpen(true);
  };

  const closeActivitiesDrawer = () => {
    setActivitiesDrawerIsOpen(false);
  };

  const items: Array<BottomBarItem> = [
    {
      id: "home",
      label: "Accueil",
      onClick: () => navigate(getPath({ page: PageName.Home })),
      IconWrapper: IconButton,
      Icon: HomeIcon,
      color: "default",
    },
    {
      id: "stats",
      label: "Stats",
      onClick: () => navigate(getPath({ page: PageName.Stats })),
      IconWrapper: IconButton,
      Icon: BarChartIcon,
      color: "default",
    },
    {
      id: "new-entry-trasparent",
      onClick: () => {},
      IconWrapper: InvisibleIconButton,
      Icon: AddIcon,
      color: "primary",
    },
    {
      id: "new-entry",
      onClick: () => openActivitiesDrawer(),
      IconWrapper: FloatingActionButton,
      Icon: AddIcon,
      color: "primary",
      isFloatingActionButton: true,
    },
    {
      id: "calendar",
      label: "Calendrier",
      onClick: () => navigate(getPath({ page: PageName.Calendar })),
      IconWrapper: IconButton,
      Icon: CalendarTodayIcon,
      color: "default",
    },
    {
      id: "settings",
      label: "Paramètres",
      onClick: () => navigate(getPath({ page: PageName.Settings })),
      IconWrapper: IconButton,
      Icon: MenuIcon,
      color: "default",
    },
  ];

  const handleActivityIconClick = (type: ActivityType) => {
    closeActivitiesDrawer();
    navigate(
      getPath({
        page: PageName.Entry,
        params: { activity: type.toString() },
      })
    );
  };

  if (pageName === PageName.Entry) {
    return null;
  }

  return (
    <AppBar
      {...props}
      position="fixed"
      sx={{
        top: "auto",
        bottom: 0,
      }}
      color="transparent"
    >
      <Container maxWidth={CSSBreakpoint.Medium} disableGutters>
        <Toolbar disableGutters>
          <Stack
            flexGrow={1}
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            {/* {shouldDisplaySaveButton && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {}}
                fullWidth
              >
                Enregistrer
              </Button>
            )} */}
            {items.map(
              ({
                id,
                onClick,
                color,
                IconWrapper,
                Icon,
                label,
                isFloatingActionButton,
              }) => (
                <IconWrapper
                  key={id}
                  color={color}
                  onClick={onClick}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    borderRadius: isFloatingActionButton ? undefined : 1,
                  }}
                >
                  {Icon && <Icon />}
                  {label && (
                    <Typography
                      variant="h6"
                      textAlign="center"
                      sx={{ fontSize: "50%" }}
                    >
                      {label}
                    </Typography>
                  )}
                </IconWrapper>
              )
            )}
          </Stack>
          <SwipeableDrawer
            anchor="bottom"
            open={activitiesDrawerIsOpen}
            onOpen={() => {}}
            onClose={() => closeActivitiesDrawer()}
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
                  <IconButton onClick={() => closeActivitiesDrawer()}>
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
              <ActivityButtons onClick={handleActivityIconClick} />
            </Box>
          </SwipeableDrawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
