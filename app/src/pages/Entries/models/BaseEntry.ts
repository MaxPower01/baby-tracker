/* -------------------------------------------------------------------------- */
/*                                    Base                                    */
/* -------------------------------------------------------------------------- */

export enum EntryType {
  Action = 1,
  Activity = 2,
  Feeding = 3,
  Growth = 4,
  Health = 5,
  Milestone = 6,
  Note = 7,
  // Appointment = 8,
}

export class EntryParser {
  public static parse<T extends BaseEntry>(data: any): T {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      switch (data.entryType) {
        case EntryType.Action:
          return ActionEntry.parse(data) as unknown as T;
        case EntryType.Activity:
        // return ActivityEntry.parse(data) as T;
        case EntryType.Feeding:
        // return FeedingEntry.parse(data) as T;
        case EntryType.Growth:
        // return GrowthEntry.parse(data) as T;
        case EntryType.Health:
        // return HealthEntry.parse(data) as T;
        case EntryType.Milestone:
        // return MilestoneEntry.parse(data) as T;
        case EntryType.Note:
        // return NoteEntry.parse(data) as T;
        default:
          throw new Error(`Unknown entry type: ${data.entryType}`);
      }
    } catch (error) {
      throw new Error(`EntryParser: Failed to parse data: ${error}`);
    }
  }
}

export abstract class BaseEntry {
  public id: string;
  public startDate: Date;
  public endDate: Date;
  public abstract entryType: EntryType;

  constructor(params: { id: string; startDate: Date; endDate: Date }) {
    this.id = params.id;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
  }

  public abstract toJSON(): object;

  public abstract serialize(): string;
}

/* -------------------------------------------------------------------------- */
/*                                   Action                                   */
/* -------------------------------------------------------------------------- */

export enum ActionEntryType {
  Cry = 1,
  Diaper = 2,
  Poop = 3,
  Regurgitation = 4,
  Vomit = 5,
  Burp = 6,
  Hiccups = 7,
  NailCutting = 8,
  Fart = 9,
}

export class ActionEntry extends BaseEntry {
  public entryType = EntryType.Action;
  public actionType: ActionEntryType;

  constructor(params: {
    id: string;
    startDate: Date;
    endDate: Date;
    actionType: ActionEntryType;
  }) {
    super(params);
    this.actionType = params.actionType;
  }

  public toJSON(): object {
    throw new Error("Method not implemented.");
  }
  public serialize(): string {
    throw new Error("Method not implemented.");
  }

  public static parse(data: any): ActionEntry {
    throw new Error("Method not implemented.");
  }

  public static deserialize(serialized: string): ActionEntry {
    return ActionEntry.parse(JSON.parse(serialized));
  }
}
