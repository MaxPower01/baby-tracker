import Child from "@/modules/authentication/types/Child";
import { User } from "firebase/auth";
import UserPreferences from "@/modules/authentication/types/UserPreferences";

export default interface CustomUser extends User {
  selectedChild: string;
  children: Child[];
  preferences: UserPreferences;
}
