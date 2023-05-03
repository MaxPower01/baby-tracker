import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import AuthenticationForm from "../modules/authentication/AuthenticationForm";

export default function AuthenticationPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <AuthenticationForm />
      <Stack justifyContent={"center"} alignItems={"center"}>
        <Typography variant={"body1"}>
          {isSignUp
            ? "Vous avez déjà un compte ?"
            : "Vous n'avez pas encore de compte ?"}
        </Typography>
        <Button variant={"text"} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Se connecter" : "Créer un compte"}
        </Button>
      </Stack>
    </Stack>
  );
}
