import AuthenticationForm from "@/modules/authentication/AuthenticationForm";
import { Stack } from "@mui/material";
import { useState } from "react";

export default function AuthenticationPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <AuthenticationForm />
      {/* <Stack justifyContent={"center"} alignItems={"center"}>
        <Typography variant={"body1"}>
          {isSignUp
            ? "Vous avez déjà un compte ?"
            : "Vous n'avez pas encore de compte ?"}
        </Typography>
        <Button variant={"text"} onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Se connecter" : "Créer un compte"}
        </Button>
      </Stack> */}
    </Stack>
  );
}
