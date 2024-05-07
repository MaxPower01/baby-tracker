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

import { CSSBreakpoint } from "@/enums/CSSBreakpoint";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import React from "react";

type Props = {
  onSaveButtonClick: () => void;
  saveButtonDisabled: boolean;
};

export function CustomBottomBar(props: Props) {
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
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
              variant="contained"
              onClick={props.onSaveButtonClick}
              fullWidth
              size="large"
              disabled={props.saveButtonDisabled}
              sx={{
                height: `calc(${theme.typography.button.fontSize} * 2.5)`,
              }}
            >
              <Typography variant="button">Enregistrer</Typography>
              <Box
                sx={{
                  display: props.saveButtonDisabled ? "flex" : "none",
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
                  size={`calc(${theme.typography.button.fontSize} * 2)`}
                />
              </Box>
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
