import Child from "@/modules/authentication/types/Child";
import CustomUser from "@/modules/authentication/types/CustomUser";
import React from "react";
import { User } from "firebase/auth";

export default interface AuthenticationContextValue {
  user: CustomUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  googleSignInWithPopup: () => Promise<{
    user: User | undefined;
    isNewUser: boolean | undefined;
  }>;
  signOut: () => Promise<boolean>;
}
