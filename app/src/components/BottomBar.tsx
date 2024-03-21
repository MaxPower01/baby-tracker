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
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import ActivityType from "@/pages/Activity/enums/ActivityType";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import HomeIcon from "@mui/icons-material/Home";
import { MenuDrawer } from "@/components/MenuDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import { NewEntryDrawer } from "@/pages/Entry/components/NewEntryDrawer";
import { PageId } from "@/enums/PageId";
import getPageId from "@/utils/getPageId";
import getPageTitle from "@/utils/getPageTitle";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/hooks/useAuthentication";

const FloatingActionButton = styled(Fab)({
  position: "absolute",
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

export function BottomBar(props: Props) {
  const { user } = useAuthentication();
  const selectedChild = useMemo(() => {
    return user?.selectedChild ?? "";
  }, [user]);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { pageId, pageTitle } = useMemo(() => {
    return {
      pageId: getPageId(pathname),
      pageTitle: getPageTitle(pathname),
    };
  }, [location.pathname]);

  const [activitiesDrawerIsOpen, setActivitiesDrawerIsOpen] = useState(false);
  const [menuDrawerIsOpen, setMenuDrawerIsOpen] = useState(false);

  const theme = useTheme();

  const items: Array<BottomBarItem> = [
    {
      id: "home",
      label: getPageTitle(getPath({ page: PageId.Home })),
      onClick: () => navigate(getPath({ page: PageId.Home })),
      IconWrapper: IconButton,
      Icon: HomeIcon,
      color: "inherit",
      isCurrentPage: pageId === PageId.Home,
      sx: {
        opacity: undefined,
      },
    },
    {
      id: "graphics",
      label: getPageTitle(getPath({ page: PageId.Graphics })),
      onClick: () => navigate(getPath({ page: PageId.Graphics })),
      IconWrapper: IconButton,
      Icon: BarChartIcon,
      color: "inherit",
      isCurrentPage: pageId === PageId.Graphics,
      sx: {
        opacity: undefined,
      },
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
        opacity: undefined,
      },
    },
    {
      id: "entries",
      onClick: () => navigate(getPath({ page: PageId.Entries })),
      label: getPageTitle(getPath({ page: PageId.Entries })),
      IconWrapper: IconButton,
      Icon: DynamicFeedIcon,
      color: "inherit",
      isCurrentPage: pageId === PageId.Entries,
      sx: {
        opacity: undefined,
      },
    },
    {
      id: "menu",
      onClick: () => setMenuDrawerIsOpen(true),
      label: "Menu",
      IconWrapper: IconButton,
      Icon: MenuIcon,
      color: "inherit",
      isCurrentPage: false,
      sx: {
        opacity: undefined,
      },
    },
  ];

  if (pageId === PageId.Entry || pageId === PageId.Child) {
    return null;
  }

  // items.forEach((item) => {
  //   console.log(item);
  //   if (item.sx && Object.keys(item.sx).includes("opacity")) {
  //     // Assign the sx property to the theme.opacity.tertiary value
  //     item.sx = { ...item.sx, opacity: theme.opacity.tertiary };
  //   }
  // });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (
      item.sx &&
      Object.keys(item.sx).includes("opacity") &&
      !item.isFloatingActionButton
    ) {
      const opacity =
        item.isCurrentPage == true
          ? theme.opacity.secondary
          : theme.opacity.tertiary;
      item.sx = { ...item.sx, opacity };
    }
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
                    // opacity:
                    //   isCurrentPage == false
                    //     ? theme.opacity.tertiary
                    //     : theme.opacity.primary,

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
                        fontWeight: isCurrentPage == true ? "bold" : 400,
                      }}
                    >
                      {label}
                    </Typography>
                  )}
                </IconWrapper>
              )
            )}
          </Stack>

          <NewEntryDrawer
            isOpen={activitiesDrawerIsOpen}
            onClose={() => setActivitiesDrawerIsOpen(false)}
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
