import CustomUser from "@/modules/authentication/models/CustomUser";
import { User } from "firebase/auth";
import React, { createContext } from "react";

export interface AuthenticationContextValue {
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

export default createContext(
  null
) as React.Context<AuthenticationContextValue | null>;
