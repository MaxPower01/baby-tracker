import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useEffect } from "react";
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";

import { selectThemeMode } from "@/state/slices/settingsSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const x = red;

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
  red: typeof red;
  pink: typeof pink;
  purple: typeof purple;
  deepPurple: typeof deepPurple;
  indigo: typeof indigo;
  blue: typeof blue;
  lightBlue: typeof lightBlue;
  cyan: typeof cyan;
  teal: typeof teal;
  green: typeof green;
  lightGreen: typeof lightGreen;
  lime: typeof lime;
  yellow: typeof yellow;
  amber: typeof amber;
  orange: typeof orange;
  deepOrange: typeof deepOrange;
  brown: typeof brown;
  grey: typeof grey;
  blueGrey: typeof blueGrey;
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
          button: {
            fontFamily: "'Noto Sans', sans-serif",
          },
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
            primary:
              themeMode === "dark"
                ? "rgba(255,255,255,0.87)"
                : "rgba(0,0,0,0.87)",
            secondary:
              themeMode === "dark"
                ? "rgba(255,255,255,0.7)"
                : "rgba(0,0,0,0.7)",
            tertiary:
              themeMode === "dark"
                ? "rgba(255,255,255,0.5)"
                : "rgba(0,0,0,0.5)",
            disabled:
              themeMode === "dark"
                ? "rgba(255,255,255,0.3)"
                : "rgba(0,0,0,0.3)",
          },
          red,
          pink,
          purple,
          deepPurple,
          indigo,
          blue,
          lightBlue,
          cyan,
          teal,
          green,
          lightGreen,
          lime,
          yellow,
          amber,
          orange,
          deepOrange,
          brown,
          grey,
          blueGrey,
        },
        opacity: {
          primary: 0.87,
          secondary: 0.7,
          tertiary: 0.5,
          disabled: 0.3,
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
