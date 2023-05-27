import Child from "@/modules/authentication/types/Child";
import { User } from "firebase/auth";

export default interface CustomUser extends User {
  selectedChild: string;
  children: Child[];
}
