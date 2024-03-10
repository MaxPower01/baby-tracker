import { ShowSnackbarProps } from "@/components/Snackbar/types/ShowSnackbarProps";

export interface SnackbarContextProps {
  showSnackbar: (props: ShowSnackbarProps) => void;
  hideSnackbar: (id: string) => void;
}
