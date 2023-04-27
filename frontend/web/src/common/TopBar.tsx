import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSBreakpoint } from "../lib/enums";

type Props = {
  component: React.ElementType<any> | undefined;
};

export default function TopBar(props: Props) {
  /* -------------------------------------------------------------------------- */
  /*                                    Setup                                   */
  /* -------------------------------------------------------------------------- */

  const theme = useTheme();
  const navigate = useNavigate();

  const [shouldRenderBackButton, setShouldRenderBackButton] = useState(false);

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
          <Typography variant="h6">Titre</Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* {renderSearchButton && (
            <IconButton onClick={() => navigate(getPath(PageName.Search))}>
              <SearchIcon />
            </IconButton>
          )} */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
