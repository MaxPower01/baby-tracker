import { Box, Stack, Typography } from "@mui/material";

import AuthenticationForm from "@/modules/authentication/components/AuthenticationForm";
import { ReactSVG } from "react-svg";

export default function AuthenticationPage() {
  return (
    <Stack
      spacing={2}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        height: "100%",
        width: "100%",
        marginTop: 4,
      }}
    >
      <Box
        sx={{
          fontSize: "10em",
        }}
      >
        <ReactSVG src="/favicon.svg" className="ActivityIcon" />
      </Box>
      <Typography variant={"h4"} textAlign={"center"}>
        Journal de bébé
      </Typography>
      <Typography variant={"body1"} textAlign={"center"}>
        Connectez-vous pour commencer à utiliser l'application
      </Typography>

      <AuthenticationForm />
    </Stack>
  );
}
