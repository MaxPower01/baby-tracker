import { Alert, Slide, SlideProps, Snackbar } from "@mui/material";

import React from "react";
import { ShowSnackbarProps } from "@/components/Snackbar/types/ShowSnackbarProps";
import { SnackbarContext } from "@/components/Snackbar/SnackbarContext";
import { SnackbarContextProps } from "@/components/Snackbar/types/SnackbarContextProps";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export function SnackbarProvider(props: React.PropsWithChildren<{}>) {
  const [snackbars, setSnackbars] = React.useState<ShowSnackbarProps[]>([]);
  const showSnackbar = (props: ShowSnackbarProps) => {
    setSnackbars((prev) => {
      const existing = prev.find((snackbar) => snackbar.id === props.id);
      if (existing) {
        return prev.map((snackbar) => {
          if (snackbar.id === props.id) {
            return { ...props, isOpen: true };
          }
          return snackbar;
        });
      } else {
        return [...prev, { ...props, isOpen: true }];
      }
    });
  };
  const hideSnackbar = (id: string) => {
    setSnackbars((prev) => {
      return prev.map((snackbar) => {
        if (snackbar.id === id) {
          return { ...snackbar, isOpen: false };
        }
        return snackbar;
      });
    });
  };
  const providerValue: SnackbarContextProps = {
    showSnackbar,
    hideSnackbar,
  };
  return (
    <SnackbarContext.Provider value={providerValue} {...props}>
      {props.children}
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          open={snackbar.isOpen}
          autoHideDuration={3000}
          onClose={() => hideSnackbar(snackbar.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={SlideTransition}
        >
          <Alert
            onClose={(
              event?: React.SyntheticEvent | Event,
              reason?: string
            ) => {
              if (reason === "clickaway") {
                return;
              }
              hideSnackbar(snackbar.id);
            }}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
}
