import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Container,
  Drawer,
  Fab,
  IconButton as MuiIconButton,
  Stack,
  Toolbar,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSBreakpoint } from "../lib/enums";
import { getPath } from "../lib/utils";

type Props = {
  component: React.ElementType<any> | undefined;
};

type BottomBarItem = {
  id: string;
  label?: string;
  onClick: React.EventHandler<React.MouseEvent>;
  IconWrapper: React.ElementType;
  Icon: React.ElementType;
  color: "primary" | "inherit" | "secondary" | "default" | undefined;
  isFloatingActionButton?: boolean;
};

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

export default function BottomBar(props: Props) {
  /* -------------------------------------------------------------------------- */
  /*                                    Setup                                   */
  /* -------------------------------------------------------------------------- */

  const navigate = useNavigate();

  const [newEntryDrawerIsOpen, setNewEntryDrawerIsOpen] = useState(false);

  const toggleNewEntryDrawer = (open: boolean) => {
    setNewEntryDrawerIsOpen(open);
  };

  const items: Array<BottomBarItem> = [
    {
      id: "entries",
      label: "Entries",
      onClick: () => navigate(getPath("")),
      IconWrapper: IconButton,
      Icon: HomeIcon,
      color: "default",
    },
    {
      id: "stats",
      label: "Stats",
      onClick: () => navigate(getPath("")),
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
      onClick: () => toggleNewEntryDrawer(true),
      IconWrapper: FloatingActionButton,
      Icon: AddIcon,
      color: "primary",
      isFloatingActionButton: true,
    },
    {
      id: "calendar",
      label: "Calendar",
      onClick: () => navigate(getPath("")),
      IconWrapper: IconButton,
      Icon: CalendarTodayIcon,
      color: "default",
    },
    {
      id: "settings",
      label: "Settings",
      onClick: () => navigate(getPath("")),
      IconWrapper: IconButton,
      Icon: MenuIcon,
      color: "default",
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <AppBar
      {...props}
      position="sticky"
      sx={{ top: "auto", bottom: 0 }}
      color="default"
    >
      <Container maxWidth={CSSBreakpoint.Large}>
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
                isFloatingActionButton,
              }) => (
                <IconWrapper
                  key={id}
                  color={color}
                  onClick={onClick}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    borderRadius: isFloatingActionButton ? undefined : 1,
                  }}
                >
                  <Icon />
                  {/* {label && (
                  <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{ fontSize: "50%" }}
                  >
                    {label}
                  </Typography>
                )} */}
                </IconWrapper>
              )
            )}
          </Stack>
          <Drawer
            anchor="bottom"
            open={newEntryDrawerIsOpen}
            onClose={() => toggleNewEntryDrawer(false)}
          >
            Test
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
