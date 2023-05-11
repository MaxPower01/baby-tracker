import App from "@/app/components/App";
import AuthenticationProvider from "@/modules/authentication/components/AuthenticationProvider";
import StoreProvider from "@/modules/store/components/StoreProvider";
import ThemeProvider from "@/modules/theme/components/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./main.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <AuthenticationProvider>
        <ThemeProvider>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </AuthenticationProvider>
    </StoreProvider>
  </React.StrictMode>
);
