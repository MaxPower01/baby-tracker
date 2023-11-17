import { BaseEntry } from "./BaseEntry";
import { EntryType } from "@/pages/Entries/models/EntryType";

export class ActivityEntry extends BaseEntry {
  public get entryType(): EntryType {
    return EntryType.Activity;
  }

  public toJSON(): object {
    throw new Error("Method not implemented.");
  }
  public serialize(): string {
    throw new Error("Method not implemented.");
  }

  public static fromJSON(json: any): ActivityEntry {
    throw new Error("Method not implemented.");
  }

  public static deserialize(serialized: string): ActivityEntry {
    return ActivityEntry.fromJSON(JSON.parse(serialized));
  }
}
