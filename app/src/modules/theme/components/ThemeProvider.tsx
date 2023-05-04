import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";
import ColorModeContext from "./ColorModeContext";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider(props: ThemeProviderProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const systemMode = prefersDarkMode ? "dark" : "light";

  // TODO:
  // Check state to see if user has selected a theme other than the system default.

  const defaultMode = systemMode;

  const [mode, setMode] = React.useState<"light" | "dark">(defaultMode);

  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
