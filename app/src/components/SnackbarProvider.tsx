import { Alert, Slide, SlideProps, Snackbar } from "@mui/material";
import React, { useContext } from "react";

interface SnackbarProps {
  id: string;
  message: string;
  severity: "error" | "warning" | "info" | "success";
  isOpen: boolean;
  /**
   * The duration in milliseconds after which the snackbar will automatically close.
   * If not set, the snackbar will auto close after 3 seconds.
   */
  autoHideDuration?: number;
}

interface SnackbarContext {
  showSnackbar: (props: SnackbarProps) => void;
  hideSnackbar: (id: string) => void;
}

const Context = React.createContext<SnackbarContext | undefined>(undefined);

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const useSnackbar = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export function SnackbarProvider(props: React.PropsWithChildren<{}>) {
  const [snackbars, setSnackbars] = React.useState<SnackbarProps[]>([]);
  const showSnackbar = (showSnackbarProps: SnackbarProps) => {
    setSnackbars((prev) => {
      const existing = prev.find(
        (snackbar) => snackbar.id === showSnackbarProps.id
      );
      if (existing) {
        return prev.map((snackbar) => {
          if (snackbar.id === showSnackbarProps.id) {
            return { ...showSnackbarProps, isOpen: true };
          }
          return snackbar;
        });
      } else {
        return [...prev, { ...showSnackbarProps, isOpen: true }];
      }
    });

    if (showSnackbarProps.autoHideDuration) {
      setTimeout(() => {
        hideSnackbar(showSnackbarProps.id);
      }, showSnackbarProps.autoHideDuration);
    }
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
  const providerValue: SnackbarContext = {
    showSnackbar,
    hideSnackbar,
  };
  return (
    <Context.Provider value={providerValue} {...props}>
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
    </Context.Provider>
  );
}
