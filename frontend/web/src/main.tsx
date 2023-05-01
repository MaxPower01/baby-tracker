import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/components/App";
import LayoutProvider from "./common/components/LayoutProvider";
import "./main.scss";
import MenuProvider from "./modules/menu/components/MenuProvider";
import StoreProvider from "./modules/store/components/StoreProvider";
import ThemeProvider from "./modules/theme/components/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <ThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <LayoutProvider>
            <MenuProvider>
              <App />
            </MenuProvider>
          </LayoutProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>
);
