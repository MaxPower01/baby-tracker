import CustomUser from "@/modules/authentication/types/CustomUser";
import { User } from "firebase/auth";
import React from "react";

export default interface AuthenticationContextValue {
  user: CustomUser | null;
  children: {
    id: string;
    name: string;
    isSelected: boolean;
  }[];
  setChildren: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
        isSelected: boolean;
      }[]
    >
  >;
  googleSignInWithPopup: () => Promise<{
    user: User | undefined;
    isNewUser: boolean | undefined;
  }>;
  signOut: () => Promise<boolean>;
}
