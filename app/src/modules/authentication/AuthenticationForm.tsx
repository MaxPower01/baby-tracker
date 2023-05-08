// import { auth, db, googleAuthProvider } from "@/firebase";
import PageName from "@/common/enums/PageName";
import { auth, db, googleAuthProvider } from "@/firebase";
import { getPath } from "@/lib/utils";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Stack, Typography } from "@mui/material";
import {
  GoogleAuthProvider,
  User,
  getAdditionalUserInfo,
  signInWithPopup,
} from "firebase/auth";
import {
  DocumentData,
  WithFieldValue,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import useEntries from "../entries/hooks/useEntries";
import CustomUser from "./models/CustomUser";
// import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";

export default function AuthenticationForm() {
  const navigate = useNavigate();
  const { getEntries } = useEntries();
  const handleGoogleSignIn = async () => {
    let user: User | undefined;
    let isNewUser: boolean | undefined;
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      const additionalUserInfo = getAdditionalUserInfo(result);
      isNewUser = additionalUserInfo?.isNewUser;
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
      const data: WithFieldValue<DocumentData> = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        providerId: user.providerId,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      };
      if (isNewUser) {
        data.selectedChild = "";
        data.children = [];
      }
      await setDoc(userRef, data, { merge: true });
      getDoc(userRef)
        .then((docSnap) => {
          getEntries(docSnap.data() as CustomUser).then(() => {});
        })
        .catch((error) => {
          console.error(error);
        });
      navigate(
        getPath({
          page: PageName.Home,
        })
      );
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
