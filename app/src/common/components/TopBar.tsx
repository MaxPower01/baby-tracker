import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DeleteIcon from "@mui/icons-material/Delete";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPageName, getPageTitle } from "../../lib/utils";
import CSSBreakpoint from "../enums/CSSBreakpoint";
import PageName from "../enums/PageName";

type Props = {
  component: React.ElementType<any> | undefined;
};

export default function TopBar(props: Props) {
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { pageName, pageTitle } = useMemo(() => {
    return {
      pageName: getPageName(pathname),
      pageTitle: getPageTitle(pathname),
    };
  }, [location.pathname]);

  const shouldRenderBackButton = useMemo(() => {
    return pageName === PageName.Entry;
  }, [pageName]);

  const handleBackButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
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
            <IconButton onClick={handleBackButtonClick}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography id="page-title" variant="h6">
            {pageTitle}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* {shouldRenderDeleteButton && (
            <IconButton onClick={() => {}}>
              <DeleteIcon />
            </IconButton>
          )} */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
