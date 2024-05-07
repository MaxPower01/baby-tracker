import { Alert, Slide, SlideProps, Snackbar } from "@mui/material";
import React, { useContext, useMemo } from "react";

interface LayoutContext {
  setBottomBarVisibility: (visibility: "visible" | "hidden") => void;
  bottomBarIsVisible: boolean;
}

const Context = React.createContext<LayoutContext | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

export function LayoutProvider(props: React.PropsWithChildren<{}>) {
  const [bottomBarIsVisible, setBottomBarIsVisible] = React.useState(true);

  const setBottomBarVisibility = (visibility: "visible" | "hidden") => {
    if (visibility === "visible") {
      setBottomBarIsVisible(true);
    } else {
      setBottomBarIsVisible(false);
    }
  };

  const providerValue: LayoutContext = useMemo(() => {
    return {
      setBottomBarVisibility,
      bottomBarIsVisible,
    };
  }, [bottomBarIsVisible]);

  return (
    <Context.Provider value={providerValue} {...props}>
      {props.children}
    </Context.Provider>
  );
}
