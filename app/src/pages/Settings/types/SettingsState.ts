import GroupEntriesBy from "@/pages/Settings/enums/GroupEntriesBy";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { ThemeMode } from "@/enums/ThemeMode";
import WeightUnit from "@/pages/Settings/enums/WeightUnit";

export default interface SettingsState {
  themeMode: ThemeMode;
  groupEntriesBy: GroupEntriesBy;
  groupEntriesInterval: GroupEntriesInterval;
  weightUnit: WeightUnit;
  showPoopQuantityInHomePage: boolean;
  showUrineQuantityInHomePage: boolean;
}
