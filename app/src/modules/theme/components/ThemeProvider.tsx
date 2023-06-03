import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useEffect } from "react";

import ColorModeContext from "@/modules/theme/components/ColorModeContext";
import { selectThemeMode } from "@/modules/settings/state/settingsSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: {
      background: {
        avatar: string;
        almostTransparent: string;
      };
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    customPalette?: {
      background?: {
        avatar?: string;
        almostTransparent?: string;
      };
    };
  }
}

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider(props: ThemeProviderProps) {
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
          // primary: {
          //   main: mode === "dark" ? "#3F6588" : "#3f51b5",
          // },
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
