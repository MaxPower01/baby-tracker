export default interface AppState {
  isLoading: boolean;
  errorMessage: string | null;
  colorMode: "light" | "dark" | "system";
}
