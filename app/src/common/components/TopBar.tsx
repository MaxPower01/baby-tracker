import CSSBreakpoint from "@/common/enums/CSSBreakpoint";
import PageName from "@/common/enums/PageName";
import { getPageName, getPageTitle, getPath } from "@/lib/utils";
import { selectEditingEntryId } from "@/modules/entries/state/entriesSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  component: React.ElementType<any> | undefined;
};

export default function TopBar(props: Props) {
  const navigate = useNavigate();

  const editingEntryId = useSelector(selectEditingEntryId);

  const { pathname } = useLocation();
  const { pageName, pageTitle } = useMemo(() => {
    return {
      pageName: getPageName(pathname),
      pageTitle: getPageTitle(pathname),
    };
  }, [pathname]);

  const shouldRenderBackButton = useMemo(() => {
    return pageName === PageName.Entry;
  }, [pageName]);

  const shouldRenderDeleteEntryButton = useMemo(() => {
    return editingEntryId != null && pageName === PageName.Entry;
  }, [pageName]);

  const handleBackButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    navigate(-1);
  };

  const handleDeleteEntryButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!editingEntryId) return;
      // TODO: Implement
      // dispatch(removeEntry(editingEntryId));
      navigate(getPath({ page: PageName.Home }));
    },
    [editingEntryId]
  );

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
            <IconButton onClick={handleBackButtonClick}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6">{pageTitle}</Typography>

          <Box sx={{ flexGrow: 1 }} />

          {shouldRenderDeleteEntryButton && (
            <IconButton onClick={handleDeleteEntryButtonClick}>
              <DeleteIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
