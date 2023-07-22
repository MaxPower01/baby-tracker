import GroupEntriesBy from "../enums/GroupEntriesBy";
import GroupEntriesInterval from "@/modules/settings/enums/GroupEntriesInterval";
import ThemeMode from "@/modules/theme/enums/ThemeMode";
import WeightUnit from "@/modules/settings/enums/WeightUnit";

export default interface SettingsState {
  themeMode: ThemeMode;
  groupEntriesBy: GroupEntriesBy;
  groupEntriesInterval: GroupEntriesInterval;
  weightUnit: WeightUnit;
  showPoopQuantityInHomePage: boolean;
  showUrineQuantityInHomePage: boolean;
}
