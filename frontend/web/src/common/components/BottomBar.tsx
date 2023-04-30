import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Container,
  Fab,
  IconButton as MuiIconButton,
  Stack,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ActivityType, CSSBreakpoint, PageName } from "../../lib/enums";
import { getPageName, getPageTitle, getPath } from "../../lib/utils";
import ActivitiesDrawer from "../../modules/activities/components/ActivitiesDrawer";

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
      onClick: () => setActivitiesDrawerIsOpen(true),
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
    >
      <Container maxWidth={CSSBreakpoint.Small} disableGutters>
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

          <ActivitiesDrawer
            isOpen={activitiesDrawerIsOpen}
            onClose={() => setActivitiesDrawerIsOpen(false)}
            handleActivityClick={(type: ActivityType) =>
              navigate(
                getPath({
                  page: PageName.Entry,
                  params: { activity: type.toString() },
                })
              )
            }
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
