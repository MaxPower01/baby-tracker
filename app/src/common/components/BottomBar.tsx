import {
  AppBar,
  Container,
  Fab,
  IconButton,
  Stack,
  SxProps,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import {
  getPageName,
  getPageTitle,
  getPath,
  isNullOrWhiteSpace,
} from "@/utils/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import ActivitiesDrawer from "@/modules/activities/components/ActivitiesDrawer";
import ActivityType from "@/modules/activities/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import HomeIcon from "@mui/icons-material/Home";
import MenuDrawer from "@/common/components/MenuDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import PageName from "@/common/enums/PageName";
import useAuthentication from "@/modules/authentication/hooks/useAuthentication";

const FloatingActionButton = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -25,
  left: 0,
  right: 0,
  margin: "0 auto",
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
  isCurrentPage?: boolean;
  sx?: SxProps;
};

type Props = {
  component: React.ElementType<any> | undefined;
};

export default function BottomBar(props: Props) {
  const { user, children } = useAuthentication();
  const selectedChild = useMemo(() => {
    return user?.selectedChild ?? "";
  }, [user, children]);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { pageName, pageTitle } = useMemo(() => {
    return {
      pageName: getPageName(pathname),
      pageTitle: getPageTitle(pathname),
    };
  }, [location.pathname]);

  const [activitiesDrawerIsOpen, setActivitiesDrawerIsOpen] = useState(false);
  const [menuDrawerIsOpen, setMenuDrawerIsOpen] = useState(false);

  const items: Array<BottomBarItem> = [
    {
      id: "home",
      label: getPageTitle(getPath({ page: PageName.Home })),
      onClick: () => navigate(getPath({ page: PageName.Home })),
      IconWrapper: IconButton,
      Icon: HomeIcon,
      color: "default",
      isCurrentPage: pageName === PageName.Home,
      // sx: {
      //   opacity: pageName === PageName.Home ? 1 : 0.6,
      //   fontWeight: pageName === PageName.Home ? "bold" : undefined,
      // },
    },
    {
      id: "graphics",
      label: getPageTitle(getPath({ page: PageName.Graphics })),
      onClick: () => navigate(getPath({ page: PageName.Graphics })),
      IconWrapper: IconButton,
      Icon: BarChartIcon,
      color: "default",
      isCurrentPage: pageName === PageName.Graphics,
      // sx: {
      //   opacity: pageName === PageName.Graphics ? 1 : 0.6,
      //   fontWeight: pageName === PageName.Graphics ? "bold" : undefined,
      // },
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
      sx: {
        display: isNullOrWhiteSpace(selectedChild) ? "none" : undefined,
      },
    },
    {
      id: "entries",
      onClick: () => navigate(getPath({ page: PageName.Entries })),
      label: getPageTitle(getPath({ page: PageName.Entries })),
      IconWrapper: IconButton,
      Icon: DynamicFeedIcon,
      color: "default",
      isCurrentPage: pageName === PageName.Entries,
      // sx: {
      //   opacity: pageName === PageName.Calendar ? 1 : 0.6,
      //   fontWeight: pageName === PageName.Calendar ? "bold" : undefined,
      // },
    },
    {
      id: "menu",
      onClick: () => setMenuDrawerIsOpen(true),
      label: "Menu",
      IconWrapper: IconButton,
      Icon: MenuIcon,
      color: "default",
      isCurrentPage: false,
      // sx: {
      //   opacity: pageName === PageName.Menu ? 1 : 0.6,
      //   fontWeight: pageName === PageName.Menu ? "bold" : undefined,
      // },
    },
  ];

  if (pageName === PageName.Entry) {
    return null;
  }

  return (
    <AppBar
      id="bottombar"
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
                isCurrentPage,
                sx,
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
                    opacity: isCurrentPage == false ? 0.6 : undefined,
                    ...sx,
                  }}
                >
                  {Icon && (
                    <Icon
                      sx={{
                        fontSize: isFloatingActionButton ? "2em" : "1em",
                      }}
                    />
                  )}
                  {label && (
                    <Typography
                      variant="body2"
                      textAlign="center"
                      sx={{
                        // fontSize: "50%",
                        fontWeight: isCurrentPage == true ? "bold" : undefined,
                      }}
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

          <MenuDrawer
            isOpen={menuDrawerIsOpen}
            onClose={() => setMenuDrawerIsOpen(false)}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
