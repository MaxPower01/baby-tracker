import "./main.scss";

import { App } from "@/app/components/App";
import { AuthenticationProvider } from "@/pages/Authentication/components/AuthenticationProvider";
import { BrowserRouter } from "react-router-dom";
import { ChildrenProvider } from "@/pages/Baby/components/ChildrenProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { EntriesProvider } from "@/pages/Entries/components/EntriesProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import { StoreProvider } from "@/store/components/StoreProvider";
import { ThemeProvider } from "@/theme/components/ThemeProvider";

// history.scrollRestoration = "manual";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <AuthenticationProvider>
        <ChildrenProvider>
          <EntriesProvider>
            <ThemeProvider>
              <CssBaseline />
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThemeProvider>
          </EntriesProvider>
        </ChildrenProvider>
      </AuthenticationProvider>
    </StoreProvider>
  </React.StrictMode>
);
