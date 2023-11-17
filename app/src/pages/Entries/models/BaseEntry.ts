import { EntryType } from "@/pages/Entries/models/EntryType";

export abstract class BaseEntry {
  public id: string;
  public startDate: Date;
  public endDate: Date;
  public abstract get entryType(): EntryType;

  constructor(params: { id: string; startDate: Date; endDate: Date }) {
    this.id = params.id;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
  }

  public abstract toJSON(): object;
  public abstract serialize(): string;
}
