import AuthenticationForm from "@/modules/authentication/components/AuthenticationForm";
import { Stack } from "@mui/material";

export default function AuthenticationPage() {
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
