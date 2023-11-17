import { BaseEntry } from "./BaseEntry";
import { EntryType } from "@/pages/Entries/models/EntryType";

export class NoteEntry extends BaseEntry {
  public get entryType(): EntryType {
    return EntryType.Note;
  }

  public toJSON(): object {
    throw new Error("Method not implemented.");
  }
  public serialize(): string {
    throw new Error("Method not implemented.");
  }

  public static fromJSON(json: any): NoteEntry {
    throw new Error("Method not implemented.");
  }

  public static deserialize(serialized: string): NoteEntry {
    return NoteEntry.fromJSON(JSON.parse(serialized));
  }
}
