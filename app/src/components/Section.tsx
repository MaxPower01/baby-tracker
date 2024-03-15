import { Box, Button, Divider, Stack, SxProps, useTheme } from "@mui/material";

export function Section(props: {
  children: React.ReactNode;
  dividerPosition?: "top" | "bottom";
  sx?: SxProps;
  title?: string;
  onClick?: () => void;
  padding?: boolean;
}) {
  const { children, dividerPosition, sx, onClick } = props;
  const theme = useTheme();
  return (
    <>
      {dividerPosition === "top" && <Divider sx={{ width: "100%" }} />}

      {onClick != null ? (
        <Button
          // elevation={0}
          onClick={() => onClick()}
          component={"section"}
          sx={{
            width: "100%",
            // paddingTop: 2,
            // paddingBottom: 2,
            ...sx,
            textTransform: "none",
            color: theme.customPalette.text.primary,
          }}
        >
          <Stack alignItems="center" spacing={2}>
            {children}
          </Stack>
        </Button>
      ) : (
        <Box
          // elevation={0}
          component={"section"}
          sx={{
            width: "100%",
            paddingTop: props.padding ? 2 : 0,
            paddingBottom: props.padding ? 2 : 0,
            ...sx,
          }}
        >
          <Stack alignItems="center" spacing={2}>
            {children}
          </Stack>
        </Box>
      )}

      {dividerPosition === "bottom" && <Divider sx={{ width: "100%" }} />}
    </>
  );
}
