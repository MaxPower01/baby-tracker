import { Box, CircularProgress, SxProps } from "@mui/material";

type Props = {
  size?: string | number;
};

export function LoadingIndicator(props: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={props.size} />
    </Box>
  );
}
