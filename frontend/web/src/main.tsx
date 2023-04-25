import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./modules/app/components/App";
import StoreProvider from "./modules/store/components/StoreProvider";
import ThemeProvider from "./modules/theme/components/ThemeProvider";

/*
  Note from official React docs:

    Strict mode can’t automatically detect side effects for you, 
    but it can help you spot them by making them a little more deterministic.
    This is done by intentionally double-invoking the following functions:

    - Class component constructor, render, and shouldComponentUpdate methods
    - Class component static getDerivedStateFromProps method
    - Function component bodies
    - State updater functions (the first argument to setState)
    - Functions passed to useState, useMemo, or useReducer

    This only applies to development mode. Lifecycles will not be double-invoked in production mode.
  
  Reference: https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects

  This is why all components are rendered twice in development mode.
*/

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <ThemeProvider>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>
);
