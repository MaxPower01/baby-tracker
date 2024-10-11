import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { customTopBarId, topbarContainerId } from "@/utils/constants";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { PageId } from "@/enums/PageId";
import { createPortal } from "react-dom";
import getPageId from "@/utils/getPageId";
import getPageTitle from "@/utils/getPageTitle";
import getPath from "@/utils/getPath";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { useAuthentication } from "@/pages/Authentication/components/AuthenticationProvider";
import { useSelector } from "react-redux";

// import { selectEditingEntryId } from "@/pages/History/state/entriesSlice";

// import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  title?: string;
  renderBackButton?: boolean;
  onBackButtonClick?: () => void;
};

export function CustomTopBar(props: Props) {
  const theme = useTheme();
  return (
    <AppBar
      id={customTopBarId}
      position="sticky"
      sx={{
        top: 0,
        background: theme.palette.background.default,
        boxShadow: "none",
        // backgroundImage: "none",
      }}
    >
      <Container maxWidth={CSSBreakpoint.Small}>
        <Toolbar disableGutters>
          {props.renderBackButton && (
            <IconButton
              onClick={() => {
                if (props.onBackButtonClick != null) {
                  props.onBackButtonClick();
                }
              }}
              sx={{
                marginRight: 1,
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          {isNullOrWhiteSpace(props.title) == false && (
            <Typography
              variant="h6"
              sx={{
                color: theme.customPalette.text.primary,
              }}
            >
              {props.title}
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
