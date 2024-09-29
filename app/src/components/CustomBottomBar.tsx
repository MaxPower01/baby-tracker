import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  customBottomBarId,
  customButtomBarSaveButtonId,
} from "@/utils/constants";

import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import React from "react";

type Props = {
  onSaveButtonClick: () => void;
  saveButtonDisabled: boolean;
  saveButtonLoading?: boolean;
  overrideSaveButtonlabel?: string;
};

export function CustomBottomBar(props: Props) {
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      id={customBottomBarId}
      component={"footer"}
      sx={{
        top: "auto",
        bottom: 0,
        backgroundColor: "background.default",
        zIndex: theme.zIndex.appBar + 1,
      }}
      color="transparent"
    >
      <Container maxWidth={CSSBreakpoint.Small}>
        <Toolbar disableGutters>
          <Stack
            flexGrow={1}
            sx={{
              paddingTop: 2,
              paddingBottom: 2,
            }}
            spacing={2}
          >
            <Button
              id={customButtomBarSaveButtonId}
              variant="contained"
              onClick={props.onSaveButtonClick}
              fullWidth
              size="large"
              disabled={props.saveButtonDisabled}
              sx={{
                height: `calc(${theme.typography.body1.fontSize} * 2.5)`,
              }}
            >
              <Typography
                variant="button"
                sx={{
                  fontSize: theme.typography.body1.fontSize,
                }}
              >
                {props.overrideSaveButtonlabel ?? "Enregistrer"}
              </Typography>
              <Box
                sx={{
                  display: props.saveButtonLoading ? "flex" : "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LoadingIndicator
                  size={`calc(${theme.typography.body1.fontSize} * 2)`}
                />
              </Box>
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
