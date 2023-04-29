import dayjs, { Dayjs } from "dayjs";
import { Activity } from "../../activities/models/Activity";

export class Entry {
  private _id: string;
  public get id(): string {
    return this._id;
  }
  public set id(v: string) {
    this._id = v;
  }

  private _activity: Activity;
  public get activity(): Activity {
    return this._activity;
  }
  public set activity(v: Activity) {
    this._activity = v;
  }

  private _dateTime: Dayjs;
  public get dateTime(): Dayjs {
    return this._dateTime;
  }
  public set dateTime(v: Dayjs) {
    this._dateTime = v;
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

  public constructor(params: {
    id?: string;
    activity: Activity;
    dateTime: Dayjs;
    durationInSeconds?: number;
    note?: string;
  }) {
    this._id = params.id || Math.random().toString(36);
    this._activity = params.activity;
    this._dateTime = params.dateTime;
    this._durationInSeconds = params.durationInSeconds;
    this._note = params.note;
  }

  public toJSON() {
    return {
      id: this._id,
      activity: this._activity.serialize(),
      dateTime: this._dateTime.toISOString(),
      durationInSeconds: this._durationInSeconds,
      note: this._note,
    };
  }

  public static fromJSON(json: any): Entry {
    const entry = new Entry({
      id: json.id,
      activity: Activity.deserialize(json.activity),
      dateTime: dayjs(json.dateTime),
      durationInSeconds: json.durationInSeconds,
      note: json.note,
    });
    return entry;
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(json: string): Entry {
    return Entry.fromJSON(JSON.parse(json));
  }
}
