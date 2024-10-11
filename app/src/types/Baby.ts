import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import { FirestoreDocument } from "@/types/FirestoreDocument";

export interface Baby extends FirestoreDocument {
  id: string;
  name: string;
  sex: string;
  birthDate: Date;
  parents: string[];
  birthWeight?: number;
  birthSize?: number;
  birthHeadCircumference?: number;
  avatar?: string;
  activityContexts?: ActivityContext[];
}
