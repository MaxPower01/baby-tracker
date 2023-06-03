import GroupEntriesBy from "../enums/GroupEntriesBy";
import ThemeMode from "@/modules/theme/enums/ThemeMode";

export default interface SettingsState {
  theme: ThemeMode;
  groupEntriesBy: GroupEntriesBy;
  useCompactMode: boolean;
}
