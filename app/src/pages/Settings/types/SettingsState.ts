import ActivityType from "@/pages/Activity/enums/ActivityType";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import GroupEntriesBy from "@/pages/Settings/enums/GroupEntriesBy";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { IntervalMethod } from "@/pages/Settings/enums/IntervalMethod";
import { ThemeMode } from "@/enums/ThemeMode";
import WeightUnit from "@/pages/Settings/enums/WeightUnit";

export default interface SettingsState {
  themeMode: ThemeMode;
  intervalMethodByEntryTypeId: Array<{
    entryTypeId: EntryTypeId;
    method: IntervalMethod;
  }>;
  entryTypesOrder: Array<EntryTypeId>;
  status: "idle" | "busy";
}
