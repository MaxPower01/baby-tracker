import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { PageId } from "@/enums/PageId";
import getPageId from "@/utils/getPageId";
import getPageTitle from "@/utils/getPageTitle";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/components/Authentication/AuthenticationProvider";
import { useSelector } from "react-redux";

// import { selectEditingEntryId } from "@/pages/History/state/entriesSlice";

// import DeleteIcon from "@mui/icons-material/Delete";

export type TopBarProps = {
  hide?: boolean;
  pageTitle?: string;
  renderBackButton?: boolean;
};

export function TopBar(props: TopBarProps) {
  const navigate = useNavigate();

  const theme = useTheme();

  const { user } = useAuthentication();

  const babyId = useMemo(() => {
    return user?.babyId ?? "";
  }, [user?.babyId]);

  // const editingEntryId = useSelector(selectEditingEntryId);

  const { pathname } = useLocation();
  const { pageName, pageTitle } = useMemo(() => {
    return {
      pageName: getPageId(pathname),
      pageTitle: getPageTitle(pathname),
    };
  }, [pathname]);

  const shouldRenderBackButton = useMemo(() => {
    return (
      pageName === PageId.Entry ||
      pageName === PageId.Baby ||
      pageName === PageId.Family ||
      pageName === PageId.Settings ||
      pageName === PageId.Activities
    );
  }, [pageName]);

  // const shouldRenderDeleteEntryButton = useMemo(() => {
  //   return editingEntryId != null && pageName === PageId.Entry;
  // }, [pageName]);

  const handleBackButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    navigate(-1);
  };

  if (props.hide == true) {
    return null;
  }

  return (
    <AppBar
      id="topbar"
      component={"header"}
      position="sticky"
      sx={{
        top: 0,
        background:
          isNullOrWhiteSpace(babyId) == true
            ? theme.palette.background.default
            : undefined,
        boxShadow: isNullOrWhiteSpace(babyId) == true ? "none" : undefined,
        // backgroundImage: "none",
      }}
    >
      <Container maxWidth={CSSBreakpoint.Small}>
        <Toolbar disableGutters>
          {props.renderBackButton == true && (
            <IconButton
              onClick={handleBackButtonClick}
              sx={{
                marginRight: 1,
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {props.pageTitle != null && (
            <Typography
              variant="h6"
              sx={{
                color: theme.customPalette.text.primary,
              }}
            >
              {pageTitle}
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* {shouldRenderDeleteEntryButton && (
            <IconButton onClick={handleDeleteEntryButtonClick}>
              <DeleteIcon />
            </IconButton>
          )} */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
