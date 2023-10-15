import Child from "@/pages/Authentication/types/Child";
import { User } from "firebase/auth";
import UserPreferences from "@/pages/Authentication/types/UserPreferences";

export default interface CustomUser extends User {
  selectedChild: string;
  children: Child[];
  preferences: UserPreferences;
}
