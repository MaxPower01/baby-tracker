import ActivityType from "@/pages/Activity/enums/ActivityType";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import GroupEntriesBy from "@/pages/Settings/enums/GroupEntriesBy";
import GroupEntriesInterval from "@/pages/Settings/enums/GroupEntriesInterval";
import { IntervalMethodId } from "@/pages/Settings/enums/IntervalMethodId";
import { ThemeMode } from "@/enums/ThemeMode";
import WeightUnit from "@/pages/Settings/enums/WeightUnit";

export interface SettingsState {
  themeMode: ThemeMode;
  intervalMethodByEntryTypeId: Array<{
    entryTypeId: EntryTypeId;
    methodId: IntervalMethodId;
  }>;
  entryTypesOrder: Array<EntryTypeId>;
  status: "idle" | "busy";
}
