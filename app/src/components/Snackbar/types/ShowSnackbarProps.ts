export interface ShowSnackbarProps {
  id: string;
  message: string;
  severity: "error" | "warning" | "info" | "success";
  isOpen: boolean;
}
