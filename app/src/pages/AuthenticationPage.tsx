import { resources } from "@/lib/utils";
import AuthenticationForm from "@/modules/authentication/components/AuthenticationForm";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function AuthenticationPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <Typography variant={"h4"} textAlign={"center"}>
        {resources.appName}
      </Typography>
      <Typography variant={"body1"} textAlign={"center"}>
        Connectez-vous pour commencer à utiliser l'application
      </Typography>
      <AuthenticationForm />
    </Stack>
  );
}
