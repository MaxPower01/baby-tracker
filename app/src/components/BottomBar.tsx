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
import { bottomBarId, bottomBarNewEntryFabId } from "@/utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

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
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";

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
  isDisabled?: boolean;
  sx?: SxProps;
};

export type BottomBarProps = {
  hide?: boolean;
};

export function BottomBar(props: BottomBarProps) {
  const { user } = useAuthentication();
  const babyId = useMemo(() => {
    return user?.babyId ?? "";
  }, [user]);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { pageId, pageTitle } = useMemo(() => {
    return {
      pageId: getPageId(pathname),
      pageTitle: getPageTitle(pathname),
    };
  }, [location.pathname]);

  const [newEntryDrawerIsOpen, setNewEntryDrawerIsOpen] = useState(false);
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
      isCurrentPage:
        isNullOrWhiteSpace(babyId) == false && pageId === PageId.Home,
      isDisabled: isNullOrWhiteSpace(babyId) == true,
      sx: {
        // opacity: isNullOrWhiteSpace(babyId) == true ? 0 : undefined,
      },
    },
    {
      id: "graphics",
      label: getPageTitle(getPath({ page: PageId.Charts })),
      onClick: () => navigate(getPath({ page: PageId.Charts })),
      IconWrapper: IconButton,
      Icon: BarChartIcon,
      color: "inherit",
      isCurrentPage:
        isNullOrWhiteSpace(babyId) == false && pageId === PageId.Charts,
      isDisabled: isNullOrWhiteSpace(babyId) == true,
      sx: {
        // opacity: isNullOrWhiteSpace(babyId) == true ? 0 : undefined,
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
      id: bottomBarNewEntryFabId,
      onClick: () => setNewEntryDrawerIsOpen(true),
      IconWrapper: FloatingActionButton,
      Icon: AddIcon,
      color: "primary",
      isFloatingActionButton: true,
      sx: {
        display: isNullOrWhiteSpace(babyId) ? "none" : undefined,
        // opacity: isNullOrWhiteSpace(babyId) == true ? 0 : undefined,
      },
    },
    {
      id: "history",
      onClick: () => navigate(getPath({ page: PageId.History })),
      label: getPageTitle(getPath({ page: PageId.History })),
      IconWrapper: IconButton,
      Icon: DynamicFeedIcon,
      color: "inherit",
      isCurrentPage:
        isNullOrWhiteSpace(babyId) == false && pageId === PageId.History,
      isDisabled: isNullOrWhiteSpace(babyId) == true,
      sx: {
        // opacity: isNullOrWhiteSpace(babyId) == true ? 0 : undefined,
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

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (
      item.sx &&
      Object.keys(item.sx).includes("opacity") &&
      !item.isFloatingActionButton
    ) {
      // const opacity =
      //   item.isCurrentPage == true
      //     ? theme.opacity.secondary
      //     : theme.opacity.tertiary;
      // item.sx = { ...item.sx, opacity };
    }
  }

  if (props.hide == true) {
    return null;
  }

  return (
    <AppBar
      id={bottomBarId}
      component={"footer"}
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
            {items.map(
              ({
                id,
                onClick,
                color,
                IconWrapper,
                Icon,
                label,
                isDisabled,
                isFloatingActionButton,
                isCurrentPage,
                sx,
              }) => (
                <IconWrapper
                  id={id}
                  key={id}
                  color={color}
                  onClick={onClick}
                  disabled={isDisabled}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    borderRadius: isFloatingActionButton ? undefined : 1,
                    ...sx,
                  }}
                >
                  {Icon && (
                    <Icon
                      sx={{
                        fontSize: isFloatingActionButton ? "2em" : "1em",
                        opacity:
                          isFloatingActionButton || isCurrentPage == true
                            ? undefined
                            : theme.opacity.secondary,
                      }}
                    />
                  )}
                  {label && (
                    <Typography
                      variant="body2"
                      textAlign="center"
                      sx={{
                        color: isDisabled
                          ? theme.customPalette.text.disabled
                          : theme.customPalette.text.secondary,
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
            isOpen={newEntryDrawerIsOpen}
            onClose={() => setNewEntryDrawerIsOpen(false)}
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
