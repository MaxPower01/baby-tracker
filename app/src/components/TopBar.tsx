import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { PageId } from "@/enums/PageId";
import getPageId from "@/utils/getPageId";
import getPageTitle from "@/utils/getPageTitle";
import getPath from "@/utils/getPath";
import { useSelector } from "react-redux";

// import { selectEditingEntryId } from "@/pages/History/state/entriesSlice";

// import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  component: React.ElementType<any> | undefined;
};

export function TopBar(props: Props) {
  const navigate = useNavigate();

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

  return (
    <AppBar
      id="topbar"
      {...props}
      position="sticky"
      sx={{
        top: 0,
        // backgroundImage: "none",
      }}
    >
      <Container maxWidth={CSSBreakpoint.Small}>
        <Toolbar disableGutters>
          {shouldRenderBackButton && (
            <IconButton
              onClick={handleBackButtonClick}
              sx={{
                marginRight: 1,
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6">{pageTitle}</Typography>

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
