import { ActivityEntry } from "@/pages/Entries/models/ActivityEntry";
import { BaseEntry } from "./BaseEntry";
import { EntryType } from "@/pages/Entries/models/EntryType";
import { NoteEntry } from "@/pages/Entries/models/NoteEntry";

export class EntryFactory {
  public static fromJSON<T extends BaseEntry>(json: any): T {
    switch (json.entryType) {
      case EntryType.Activity:
        return ActivityEntry.fromJSON(json) as T;
      case EntryType.Note:
        return NoteEntry.fromJSON(json) as T;
      default:
        throw new Error(`Unknown entry type: ${json.entryType}`);
    }
  }

  public static deserialize<T extends BaseEntry>(serialized: string): T {
    return EntryFactory.fromJSON(JSON.parse(serialized)) as T;
  }
}
