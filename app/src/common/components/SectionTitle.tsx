import { Typography } from "@mui/material";

export default function SectionTitle(props: { title: string }) {
  return (
    <Typography
      variant="h5"
      textAlign="left"
      sx={{
        fontWeight: "bold",
        width: "100%",
      }}
    >
      {props.title}
    </Typography>
  );
}
