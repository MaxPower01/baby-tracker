import { Typography } from "@mui/material";

export default function SectionTitle(props: { title: string }) {
  return (
    <Typography
      variant="h6"
      textAlign="left"
      sx={{
        width: "100%",
        opacity: 0.6,
        fontStyle: "italic",
      }}
    >
      {props.title}
    </Typography>
  );
}
