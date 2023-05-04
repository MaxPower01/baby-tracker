import { Box, CircularProgress } from "@mui/material";

export default function LoadingIndicator() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
