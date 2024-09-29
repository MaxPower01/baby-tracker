import { Typography, useTheme } from "@mui/material";

export function SectionTitle(props: { title: string }) {
  const theme = useTheme();
  return (
    <Typography
      variant="h6"
      textAlign="left"
      sx={{
        width: "100%",
        color: theme.customPalette.text.secondary,
        // opacity: 0.6,
        // fontStyle: "italic",
      }}
    >
      {props.title}
    </Typography>
  );
}
