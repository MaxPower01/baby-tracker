import { User } from "firebase/auth";
import React, { createContext } from "react";

export interface AuthenticationContextValue {
  user: User | null;
  selectedChild: string;
  setSelectedChild: React.Dispatch<React.SetStateAction<string>>;
  googleSignInWithPopup: () => Promise<{
    user: User | undefined;
    isNewUser: boolean | undefined;
  }>;
  signOut: () => Promise<boolean>;
}

export default createContext(
  null
) as React.Context<AuthenticationContextValue | null>;
