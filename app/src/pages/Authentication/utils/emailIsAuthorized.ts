import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase";

export async function emailIsAuthorized(email: string): Promise<boolean> {
  const authorizedUsersDoc = await getDoc(
    doc(db, "appSettings", "authorizedUsers")
  );
  if (authorizedUsersDoc.exists()) {
    const authorizedUsers = authorizedUsersDoc.data();
    if (authorizedUsers) {
      return (authorizedUsers.emails as string[]).includes(email);
    }
  }
  return false;
}
