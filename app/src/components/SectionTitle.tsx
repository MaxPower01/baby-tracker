import { Typography, useTheme } from "@mui/material";

export default function SectionTitle(props: { title: string }) {
  const theme = useTheme();
  return (
    <Typography
      variant="h6"
      textAlign="left"
      color={theme.customPalette.text.secondary}
      sx={{
        width: "100%",
        // opacity: 0.6,
        // fontStyle: "italic",
      }}
    >
      {props.title}
    </Typography>
  );
}
