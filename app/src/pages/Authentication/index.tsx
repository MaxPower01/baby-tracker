import { Box, Stack, Typography } from "@mui/material";

import AuthenticationForm from "@/pages/Authentication/components/AuthenticationForm";
import { ReactSVG } from "react-svg";

export default function AuthenticationPage() {
  return (
    <Stack
      spacing={4}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        height: "100%",
        width: "100%",
        marginTop: 4,
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            fontSize: "12em",
          }}
        >
          <ReactSVG src="/favicon.svg" className="ActivityIcon" />
        </Box>
        <Typography variant={"h4"} textAlign={"center"} fontWeight={600}>
          Journal de bébé
        </Typography>
        <Typography variant={"body1"} textAlign={"center"}>
          Connectez-vous pour commencer
        </Typography>
      </Stack>

      <AuthenticationForm />
    </Stack>
  );
}
