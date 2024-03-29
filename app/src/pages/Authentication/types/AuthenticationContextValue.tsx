import Baby from "@/pages/Authentication/types/Baby";
import CustomUser from "@/pages/Authentication/types/CustomUser";
import React from "react";
import { User } from "firebase/auth";

export default interface AuthenticationContextValue {
  user: CustomUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
  googleSignInWithPopup: () => Promise<{
    user: User | undefined;
    isNewUser: boolean | undefined;
  }>;
  signOut: () => Promise<boolean>;
}
