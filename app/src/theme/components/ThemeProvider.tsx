import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useEffect } from "react";

import ColorModeContext from "@/theme/components/ColorModeContext";
import { selectThemeMode } from "@/pages/Settings/state/settingsSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

type CustomPalette = {
  background: {
    avatar: string;
    almostTransparent: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
};

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: CustomPalette;
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    customPalette?: CustomPalette;
  }
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider(props: ThemeProviderProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const systemMode = prefersDarkMode ? "dark" : "light";

  // TODO:
  // Check state to see if user has selected a theme other than the system default.

  const defaultMode = systemMode;

  // const initialThemeMode = useSelector(selectThemeMode);

  const [themeMode, setThemeMode] = React.useState<"light" | "dark">(
    defaultMode
  );

  useEffect(() => {
    setThemeMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "'Noto Sans', sans-serif",
        },
        palette: {
          mode: themeMode,
          background: {
            default: themeMode === "dark" ? "#1E212A" : "#fff",
            paper: themeMode === "dark" ? "#222530" : "#fff",
          },
        },
        customPalette: {
          background: {
            avatar:
              themeMode === "dark" ? "hsl(0 0% 20% / 1)" : "hsl(0 0% 80% / 1)",
            almostTransparent:
              themeMode === "dark"
                ? "hsl(0 0% 100% / 0.035)"
                : "hsl(0 0% 0% / 0.035)",
          },
          text: {
            primary: themeMode === "dark" ? "#ffffff" : "#000000",
            secondary: themeMode === "dark" ? "#ffffff80" : "#00000080",
            tertiary: themeMode === "dark" ? "#ffffff50" : "#00000050",
          },
        },
        shape: {
          borderRadius: 16,
        },
      }),
    [themeMode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
