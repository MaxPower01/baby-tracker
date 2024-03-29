import Baby from "@/pages/Authentication/types/Baby";
import { User } from "firebase/auth";
import UserPreferences from "@/pages/Authentication/types/UserPreferences";

export default interface CustomUser extends User {
  babyId: string;
  babies: Baby[];
  preferences: UserPreferences;
}
