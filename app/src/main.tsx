import "./main.scss";

import App from "@/app/components/App";
import AuthenticationProvider from "@/modules/authentication/components/AuthenticationProvider";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import EntriesProvider from "@/modules/entries/components/EntriesProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import StoreProvider from "@/modules/store/components/StoreProvider";
import ThemeProvider from "@/modules/theme/components/ThemeProvider";

// history.scrollRestoration = "manual";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <AuthenticationProvider>
        <EntriesProvider>
          <ThemeProvider>
            <CssBaseline />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </EntriesProvider>
      </AuthenticationProvider>
    </StoreProvider>
  </React.StrictMode>
);
