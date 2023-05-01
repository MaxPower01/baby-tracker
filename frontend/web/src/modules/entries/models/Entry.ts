import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";
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

  private _startDate: Dayjs;
  public get startDate(): Dayjs {
    return this._startDate;
  }
  public set startDate(v: Dayjs) {
    this._startDate = v;
  }

  public get timestamp(): number {
    return this.startDate.unix();
  }

  private _time: number | undefined;
  public get time(): number | undefined {
    return this._time;
  }
  public set time(v: number | undefined) {
    this._time = v;
  }

  private _leftTime: number | undefined;
  public get leftTime(): number | undefined {
    return this._leftTime;
  }
  public set leftTime(v: number | undefined) {
    this._leftTime = v;
  }

  private _rightTime: number | undefined;
  public get rightTime(): number | undefined {
    return this._rightTime;
  }
  public set rightTime(v: number | undefined) {
    this._rightTime = v;
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
    startDate?: Dayjs | null;
    time?: number;
    leftTime?: number;
    rightTime?: number;
    note?: string;
  }) {
    this._id = params.id || uuidv4();
    this._activity = params.activity;
    this._startDate = params.startDate || dayjs();
    this._time = params.time;
    this._leftTime = params.leftTime;
    this._rightTime = params.rightTime;
    this._note = params.note;
  }

  public toJSON() {
    return {
      id: this._id,
      activity: this._activity.serialize(),
      startDate: this._startDate.toISOString(),
      time: this._time,
      leftTime: this._leftTime,
      rightTime: this._rightTime,
      note: this._note,
    };
  }

  public static fromJSON(json: any): Entry {
    const entry = new Entry({
      id: json.id,
      activity: Activity.deserialize(json.activity),
      startDate: dayjs(json.startDate),
      time: json.time,
      leftTime: json.leftTime,
      rightTime: json.rightTime,
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
