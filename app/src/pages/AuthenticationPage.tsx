import AuthenticationForm from "@/modules/authentication/components/AuthenticationForm";
import { Stack, Typography } from "@mui/material";

export default function AuthenticationPage() {
  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
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
