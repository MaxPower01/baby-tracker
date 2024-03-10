import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useEffect } from "react";

import { selectThemeMode } from "@/state/settingsSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

type CustomPalette = {
  background: {
    avatar: string;
    almostTransparent: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
  };
};

type ThemeOpacity = {
  primary: number;
  secondary: number;
  tertiary: number;
  disabled: number;
};

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: CustomPalette;
    opacity: ThemeOpacity;
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    customPalette?: CustomPalette;
    opacity?: ThemeOpacity;
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
          action: {
            active: "rgba(255, 255, 255, 0.56)",
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
            secondary: themeMode === "dark" ? "#ffffffde" : "#000000de",
            tertiary: themeMode === "dark" ? "#ffffffb3" : "#000000b3",
            disabled: themeMode === "dark" ? "#ffffff66" : "#00000066",
          },
        },
        opacity: {
          primary: 1,
          secondary: 0.87,
          tertiary: 0.6,
          disabled: 0.38,
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
