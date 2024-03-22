import { ActivityContext } from "@/pages/Activity/types/ActivityContext";
import ActivityType from "@/pages/Activity/enums/ActivityType";
import { NasalHygiene } from "@/types/NasalHygiene";
import { NasalHygieneId } from "@/enums/NasalHygieneId";
import { PoopColor } from "@/types/PoopColor";
import { PoopColorId } from "@/enums/PoopColorId";
import { PoopConsistency } from "@/types/PoopConsistency";
import { PoopTextureId } from "@/enums/PoopTextureId";
import { TemperatureMethod } from "@/types/TemperatureMethod";
import { TemperatureMethodId } from "@/enums/TemperatureMethodId";

export default interface ActivitiesState {
  activities: string[];
  activitiesOrder: ActivityType[];
  activityContexts: ActivityContext[];
  temperatureMethods: TemperatureMethod[];
  nasalHygieneTypes: NasalHygiene[];
  poopConsistencyTypes: PoopConsistency[];
  poopColors: PoopColor[];
}
