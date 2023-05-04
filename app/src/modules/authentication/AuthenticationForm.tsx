import { auth, googleAuthProvider } from "@/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Stack, Typography } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function AuthenticationForm() {
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <Stack spacing={2}>
      <Button variant="contained" onClick={handleGoogleSignIn} fullWidth>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={"center"}
        >
          <GoogleIcon />
          <Typography variant="button">Continuer avec Google</Typography>
        </Stack>
      </Button>
    </Stack>
  );
}
