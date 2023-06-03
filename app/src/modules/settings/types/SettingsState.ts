import GroupEntriesBy from "./GroupEntriesBy";

export default interface SettingsState {
  theme: "light" | "dark";
  groupEntriesBy: GroupEntriesBy;
  useCompactMode: boolean;
}
