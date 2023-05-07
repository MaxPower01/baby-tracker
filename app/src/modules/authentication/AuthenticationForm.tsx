// import { auth, db, googleAuthProvider } from "@/firebase";
import { auth, db, googleAuthProvider } from "@/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Stack, Typography } from "@mui/material";
import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";

export default function AuthenticationForm() {
  const handleGoogleSignIn = async () => {
    let user: User | undefined;
    // let isNewUser: boolean | undefined;
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // const additionalUserInfo = getAdditionalUserInfo(result);
      // isNewUser = additionalUserInfo?.isNewUser;
      user = result.user;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(errorCode, errorMessage, email, credential);
    }
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        providerId: user.providerId,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      });
    } catch (error: any) {
      console.error(error);
    }
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
