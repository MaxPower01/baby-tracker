import "@/main.scss";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { App } from "@/components/App";
import { AuthenticationProvider } from "@/pages/Authentication/components/AuthenticationProvider";
import { BabiesProvider } from "@/pages/Baby/components/BabiesProvider";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { EntriesProvider } from "@/pages/Entries/components/EntriesProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "@/components/SnackbarProvider";
import { StoreProvider } from "@/components/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <AuthenticationProvider>
        <BabiesProvider>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="fr-ca"
          >
            <ThemeProvider>
              <SnackbarProvider>
                <CssBaseline />
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </SnackbarProvider>
            </ThemeProvider>
          </LocalizationProvider>
        </BabiesProvider>
      </AuthenticationProvider>
    </StoreProvider>
  </React.StrictMode>
);
