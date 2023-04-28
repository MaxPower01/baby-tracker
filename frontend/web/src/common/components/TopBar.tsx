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
import { useNavigate } from "react-router-dom";
import { CSSBreakpoint, PageName } from "../../lib/enums";
import { getCurrentPageName, getPageTitle } from "../../lib/utils";
import useLayout from "../hooks/useLayout";

type Props = {
  component: React.ElementType<any> | undefined;
};

export default function TopBar(props: Props) {
  /* -------------------------------------------------------------------------- */
  /*                                    Setup                                   */
  /* -------------------------------------------------------------------------- */

  const layout = useLayout();
  const navigate = useNavigate();
  const currentPage = getCurrentPageName();
  const pageTitle = getPageTitle(currentPage);

  const shouldRenderBackButton = currentPage == PageName.Entry;

  const handleBackButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate(-1);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <AppBar
      {...props}
      position="sticky"
      sx={{
        top: 0,
        // backgroundImage: "none",
      }}
    >
      <Container maxWidth={CSSBreakpoint.Medium}>
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

          {layout.shouldRenderDeleteButton && (
            <IconButton onClick={() => {}}>
              <DeleteIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
