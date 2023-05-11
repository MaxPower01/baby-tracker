import ColorModeContext from "@/modules/theme/components/ColorModeContext";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: {
      background: {
        avatar: string;
      };
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    customPalette?: {
      background?: {
        avatar?: string;
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
        customPalette: {
          background: {
            avatar: mode === "dark" ? "hsl(0 0% 20% / 1)" : "hsl(0 0% 80% / 1)",
          },
        },
        shape: {
          borderRadius: 16,
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
