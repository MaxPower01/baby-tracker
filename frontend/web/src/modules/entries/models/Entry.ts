import { Activity } from "../../activities/models/Activity";

export class Entry {
  private _activity: Activity;
  public get activity(): Activity {
    return this._activity;
  }
  public set activity(v: Activity) {
    this._activity = v;
  }

  private _startDate: Date;
  public get startDate(): Date {
    return this._startDate;
  }
  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date | undefined;
  public get endDate(): Date | undefined {
    return this._endDate;
  }
  public set endDate(v: Date | undefined) {
    this._endDate = v;
  }

  private _durationInSeconds: number | undefined;
  public get durationInSeconds(): number | undefined {
    return this._durationInSeconds;
  }
  public set durationInSeconds(v: number | undefined) {
    this._durationInSeconds = v;
  }

  private _note: string | undefined;
  public get note(): string | undefined {
    return this._note;
  }
  public set note(v: string | undefined) {
    this._note = v;
  }

  public constructor(activity: Activity, startDate?: Date) {
    this._activity = activity;
    this._startDate = startDate || new Date();
  }

  public toJSON() {
    return {
      activity: this._activity.serialize(),
      startDate: this._startDate,
      endDate: this._endDate,
      durationInSeconds: this._durationInSeconds,
      note: this._note,
    };
  }

  public static fromJSON(json: any): Entry {
    const entry = new Entry(json.activity, json.startDate);
    entry.endDate = json.endDate;
    entry.durationInSeconds = json.durationInSeconds;
    entry.note = json.note;
    return entry;
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(json: string): Entry {
    return Entry.fromJSON(JSON.parse(json));
  }
}
